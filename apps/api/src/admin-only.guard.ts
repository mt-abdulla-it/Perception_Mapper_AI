import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";

@Injectable()
export class AdminOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("Access Denied: Authentication credentials not found.");
    }

    if (user.role?.toUpperCase() !== "ADMIN") {
      throw new ForbiddenException(
        "Access Denied: You do not possess administrative permissions to access this endpoint."
      );
    }

    return true;
  }
}
