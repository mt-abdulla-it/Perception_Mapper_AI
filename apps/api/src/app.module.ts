import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { PrismaService } from "./prisma.service";
import { AppService } from "./app.service";
import { RateLimiterService } from "./rate-limiter.service";
import { TelemetryGateway } from "./telemetry/telemetry.gateway";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [PrismaService, AppService, RateLimiterService, TelemetryGateway],
})
export class AppModule {}
