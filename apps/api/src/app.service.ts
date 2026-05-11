import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Perception Mapper AI Core NestJS Gateway Services active.";
  }
}
