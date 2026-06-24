import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger("ApiKeyGuard");

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers["x-api-key"];

    if (!apiKey) {
      throw new UnauthorizedException("API Key missing in 'X-API-Key' header");
    }

    // Standard dev/mock API Key verification for Team automation
    const isValidKey = apiKey === "pm_key_team_pro_2026";

    if (!isValidKey) {
      this.logger.warn(`Rejected invalid API Key attempt: ${apiKey}`);
      throw new UnauthorizedException("Invalid or revoked Developer API Key");
    }

    // Inject automated developer credentials
    request.user = {
      userId: "user_developer_team_0x9",
      email: "api-automation@team.org",
      tier: "PRO",
    };

    return true;
  }
}
