import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import * as jwksRsa from "jwks-rsa";
import { PrismaService } from "./prisma.service";

const jwksClient = typeof jwksRsa === "function"
  ? jwksRsa
  : ((jwksRsa as any).default || jwksRsa);

@Injectable()
export class ClerkGuard implements CanActivate {
  private readonly logger = new Logger("ClerkGuard");
  private jwksClientInstance: any;

  constructor(private readonly prisma: PrismaService) {
    // Standard Clerk JWKS client retrieval setup
    const jwksUri = process.env.CLERK_JWKS_URI || "https://api.clerk.com/v1/jwks";
    this.jwksClientInstance = jwksClient({
      jwksUri: jwksUri,
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 10,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // 1. Check if Clerk keys are missing (Scaffold/Dev Mode fallback)
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      this.logger.warn(
        "CLERK_SECRET_KEY is not defined. Falling back to Scaffolding/Dev Mode. All requests bypass verification."
      );
      
      const mockUserId = "user_mock_dev_2k98fhj3";
      const mockEmail = "dev@perceptionmapper.ai";
      
      // Sync or retrieve mock profile
      const dbUser = await this.prisma.syncUser(mockUserId, mockEmail);
      
      // Support toggling the active role dynamically via client role switcher headers
      const clientMockRole = request.headers["x-mock-role"];
      if (clientMockRole) {
        dbUser.role = clientMockRole.toString().toUpperCase();
      }

      if (dbUser.isBlocked) {
        throw new ForbiddenException("Access Denied: Your account has been suspended by an administrator.");
      }

      // Inject mock user information to let development progress seamlessly
      request.user = {
        userId: dbUser.id,
        email: dbUser.email,
        tier: dbUser.tier,
        role: dbUser.role,
      };
      
      return true;
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      this.logger.warn("Authorization header missing or format invalid.");
      throw new UnauthorizedException("Bearer Authorization token required");
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded: any = jwt.decode(token, { complete: true });
      if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new UnauthorizedException("Invalid JWT token format");
      }

      // Fetch the public signing key from Clerk JWKS endpoint
      const signingKey = await this.getSigningKey(decoded.header.kid);
      const publicKey = signingKey.getPublicKey();

      // Verify the JWT signature and expiration
      const verifiedPayload = jwt.verify(token, publicKey, {
        algorithms: ["RS256"],
      }) as any;

      const userEmail = verifiedPayload.email || "user@perceptionmapper.ai";
      
      // Lazy sync authenticated profile in database
      const dbUser = await this.prisma.syncUser(verifiedPayload.sub, userEmail);

      // Support dynamic role switching for Clerk users too
      const clientMockRole = request.headers["x-mock-role"];
      if (clientMockRole) {
        dbUser.role = clientMockRole.toString().toUpperCase();
      }

      if (dbUser.isBlocked) {
        throw new ForbiddenException("Access Denied: Your account has been suspended by an administrator.");
      }

      // Inject verified payload into request context
      request.user = {
        userId: dbUser.id, // Clerk user ID
        sessionId: verifiedPayload.sid, // Clerk session ID
        email: dbUser.email,
        tier: dbUser.tier,
        role: dbUser.role,
      };

      return true;
    } catch (error) {
      this.logger.error(`Clerk JWT Verification failed: ${error.message}`);
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException("Session expired or token invalid");
    }
  }

  private getSigningKey(kid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.jwksClientInstance.getSigningKey(kid, (err: any, key: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(key);
        }
      });
    });
  }
}
