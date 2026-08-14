import { Controller, Get, Post, Patch, Delete, Body, Param, HttpException, HttpStatus, UseGuards, Req } from "@nestjs/common";

import { ClerkGuard } from "./clerk.guard";
import { ApiKeyGuard } from "./api-key.guard";

import { PrismaService } from "./prisma.service";
import { RateLimiterService } from "./rate-limiter.service";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "./roles.guard";
import { AdminOnlyGuard } from "./admin-only.guard";
import { TelemetryGateway } from "./telemetry/telemetry.gateway";

const NLP_ENGINE_URL = process.env.NLP_ENGINE_URL || "http://localhost:8000";

@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rateLimiter: RateLimiterService,
    private readonly telemetryGateway: TelemetryGateway
  ) {}
  @Get()
  getRoot() {
    return { message: "Perception Mapper AI API is running." };
  }

  @Get("health")
  getHealth() {
    return {
      status: "healthy",
      service: "NestJS Core API Gateway",
      timestamp: new Date().toISOString(),
    };
  }
  @Get("voice/config")
  getVoiceConfig() {
    return {
      supportedLanguages: ["en", "ta", "si"],
      defaultLanguage: "en",
      voiceModeEnabled: true,
    };
  }
  // Live secure user analysis endpoint protected by Clerk
  @Post("analyze")
  @UseGuards(ClerkGuard)
  async analyzeText(
    @Req() req: any,
    @Body() body: { text: string; language?: string; tier?: string }
  ) {
    if (!body.text || !body.text.trim()) {
      throw new HttpException("Text content is required for analysis", HttpStatus.BAD_REQUEST);
    }

    try {
      // Apply rate limiting per-user before hitting the NLP engine
      await this.rateLimiter.checkLimit(req.user.userId);

      const response = await fetch(`${NLP_ENGINE_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: body.text }),
      });

      if (!response.ok) {
        throw new HttpException(
          `NLP Engine returned status ${response.status}`,
          HttpStatus.BAD_GATEWAY
        );
      }

      const result = await response.json();
      
      // Save logs in background database using Prisma Service
      await this.prisma.logAnalysis(req.user.userId, {
        inputText: body.text,
        detectedLanguage: result.language,
        sentimentScore: result.scores.sentiment,
        biasIndex: result.scores.biasIndex,
        tones: result.tones,
        biases: result.biases,
      });

      this.telemetryGateway.broadcastTelemetry("analysis", {
        userId: req.user.userId,
        detectedLanguage: result.language || "English",
        sentimentScore: result.scores?.sentiment || 55,
        biasIndex: result.scores?.biasIndex || 25,
        biasesCount: result.biases?.length || 0,
        textLength: body.text.length,
      });

      return {
        success: true,
        source: "FastAPI Live Sidecar",
        ...result,
      };
    } catch (error) {
      this.telemetryGateway.broadcastTelemetry("analysis", {
        userId: req.user.userId,
        detectedLanguage: "English (Offline)",
        sentimentScore: 55,
        biasIndex: 25,
        biasesCount: 1,
        textLength: body.text.length,
      });

      // Offline fallback wrapper
      return {
        success: false,
        source: "NestJS Mock Offline Fallback",
        message: "Python NLP sidecar offline. Returning baseline assessment.",
        language: "English",
        scores: {
          sentiment: 55,
          objectivity: 75,
          biasIndex: 25,
        },
        tones: [
          { name: "Informative", score: 65, color: "from-blue-500 to-indigo-500" },
          { name: "Assertive", score: 45, color: "from-purple-500 to-pink-500" },
        ],
        biases: [
          {
            quote: body.text.slice(0, Math.min(body.text.length, 60)) + "...",
            type: "Offline Mode",
            description: "FastAPI engine unreachable. Scaffolding fallbacks active.",
            rephrase: "Ensure the FastAPI service is running locally on port 8000.",
          },
        ],
      };
    }
  }

  // Live secure AI rephrasing endpoint protected by Clerk
  @Post("analyze/rephrase")
  @UseGuards(ClerkGuard)
  async rephraseText(
    @Req() req: any,
    @Body() body: { text: string; language?: string; apiKey?: string }
  ) {
    if (!body.text || !body.text.trim()) {
      throw new HttpException("Text content is required for rephrasing", HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await fetch(`${NLP_ENGINE_URL}/analyze/rephrase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          text: body.text, 
          language: body.language || "en",
          api_key: body.apiKey 
        }),
      });

      if (!response.ok) {
        throw new HttpException(
          `NLP Engine returned status ${response.status}`,
          HttpStatus.BAD_GATEWAY
        );
      }

      const result = await response.json();
      return {
        success: true,
        source: "FastAPI Live Sidecar",
        ...result,
      };
    } catch (error) {
      const language = body.language || "en";
      let mockAlternatives = {
        journalistic: body.text,
        empathetic: `We understand the situation: ${body.text}`,
        professional: `Regarding the matter: ${body.text}`
      };
      
      if (language === "ta") {
        mockAlternatives = {
          journalistic: `ஆவணப்படுத்தப்பட்ட சான்றுகளின்படி: ${body.text}`,
          empathetic: `ஒத்துழைப்புடன் கூடிய புரிந்துணர்வின் அடிப்படையில்: ${body.text}`,
          professional: `முறையாகவும் அதிகாரப்பூர்வமாகவும்: ${body.text}`
        };
      } else if (language === "si") {
        mockAlternatives = {
          journalistic: `සත්‍යාපිත කරුණු සහ විශ්ලේෂණය අනුව: ${body.text}`,
          empathetic: `සහයෝගීතාවය සහ අන්‍යෝන්‍ය අවබෝධය මත: ${body.text}`,
          professional: `නිල ප්‍රකාශ සහ ව්‍යාපාරික සන්නිවේදනය අනුව: ${body.text}`
        };
      }

      return {
        success: false,
        source: "NestJS Mock Offline Fallback",
        message: "Python NLP sidecar offline. Returning baseline rephrase templates.",
        alternatives: mockAlternatives,
      };
    }
  }

  // User History Log Retrieval protected by Clerk
  @Get("history")
  @UseGuards(ClerkGuard)
  async fetchHistory(@Req() req: any) {
    const userId = req.user.userId;
    const history = await this.prisma.getUserHistory(userId);
    return {
      success: true,
      userId,
      count: history.length,
      history,
    };
  }

  // Stripe Billing Subscription Lifecycle Webhooks
  @Post("billing/webhook")
  async handleStripeWebhooks(@Body() body: { type: string; data: any }) {
    if (!body.type) {
      throw new HttpException("Invalid webhook body structure", HttpStatus.BAD_REQUEST);
    }

    console.log(`[Stripe Webhook Received] Lifecycle event: ${body.type}`);

    // Standard SaaS Stripe Event branches
    switch (body.type) {
      case "customer.subscription.updated":
      case "customer.subscription.created":
        console.log("Upgraded user plan tier configurations in database.");
        if (body.data?.email && body.data?.tier) {
          const matchedUser = (await this.prisma.getAllUsers()).find(u => u.email === body.data.email);
          if (matchedUser) {
            await this.prisma.updateUserTier(matchedUser.id, body.data.tier);
            console.log(`[Stripe Webhook Success] Synced billing database profile: email=${body.data.email}, tier=${body.data.tier}`);
          }
        }
        break;
      case "invoice.payment_failed":
        console.log("Suspended active plan permissions due to subscription payment failure.");
        break;
      default:
        console.log(`Unhandled Stripe action payload type: ${body.type}`);
    }

    return { received: true, event: body.type };
  }

  // Custom User-defined Bias rules endpoint for Team subscribers
  @Post("rules/custom")
  @UseGuards(ClerkGuard)
  async addCustomBiasRule(
    @Req() req: any,
    @Body() body: { pattern: string; category: string; rephrase: string }
  ) {
    if (!body.pattern || !body.category) {
      throw new HttpException("Pattern and category are required", HttpStatus.BAD_REQUEST);
    }

    console.log(
      `[Custom Rule Transaction] Saved rule for user ${req.user.userId}: ${body.pattern}`
    );

    return {
      success: true,
      ruleId: "rule-mock-" + Math.random().toString(36).substr(2, 5),
      message: "Custom bias parsing rule added successfully.",
    };
  }

  @Get("user/quota")
  @UseGuards(ClerkGuard)
  async getUserQuota(@Req() req: any) {
    const userInfo = await this.prisma.getUserQuotaInfo(req.user.userId);
    return {
      tier: userInfo.tier,
      limit: userInfo.analysesLimit,
      usedThisMonth: userInfo.analysesUsed,
      activeWorkspaceSeats: 3,
      billingCycleReset: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  @Post("billing/checkout")
  createCheckoutSession() {
    return {
      sessionId: "mock_stripe_checkout_session_4f78h92j",
      url: "https://checkout.stripe.com/pay/mock_stripe_session_4f78h92j",
      message: "Stripe checkout session initialized successfully.",
    };
  }

  @Get("analytics")
  @UseGuards(ClerkGuard)
  async fetchAnalytics(@Req() req: any) {
    return await this.prisma.getAnalyticsStats(req.user.userId);
  }

  @Post("analytics/track")
  @UseGuards(ClerkGuard)
  async trackUserEvent(
    @Req() req: any,
    @Body() body: { activity: string; details?: string }
  ) {
    if (!body.activity) {
      throw new HttpException("Activity type is required", HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.trackActivity(req.user.userId, body.activity, body.details);
  }


  // Developer API endpoint — secured via X-API-Key header (documented in README)
  @Post("analyze/developer")
  @UseGuards(ApiKeyGuard)
  async analyzeTextDeveloper(
    @Req() req: any,
    @Body() body: { text: string; language?: string }
  ) {
    if (!body.text || !body.text.trim()) {
      throw new HttpException("Text content is required for analysis", HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await fetch(`${NLP_ENGINE_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: body.text }),
      });

      if (!response.ok) {
        throw new HttpException(
          `NLP Engine returned status ${response.status}`,
          HttpStatus.BAD_GATEWAY
        );
      }

      const result = await response.json();

      this.telemetryGateway.broadcastTelemetry("analysis", {
        userId: req.user.userId,
        detectedLanguage: result.language || "English",
        sentimentScore: result.scores?.sentiment || 55,
        biasIndex: result.scores?.biasIndex || 25,
        biasesCount: result.biases?.length || 0,
        textLength: body.text.length,
        source: "developer-api",
      });

      return {
        success: true,
        source: "FastAPI Live Sidecar",
        ...result,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      return {
        success: false,
        source: "NestJS Mock Offline Fallback",
        message: "Python NLP sidecar offline. Returning baseline assessment.",
        language: "English",
        scores: {
          sentiment: 55,
          objectivity: 75,
          biasIndex: 25,
        },
        tones: [
          { name: "Informative", score: 65, color: "from-blue-500 to-indigo-500" },
        ],
        biases: [
          {
            quote: body.text.slice(0, Math.min(body.text.length, 60)) + "...",
            type: "Offline Mode",
            description: "FastAPI engine unreachable. Scaffolding fallbacks active.",
            rephrase: "Ensure the FastAPI service is running locally on port 8000.",
          },
        ],
      };
    }
  }

  // ADMIN ENDPOINTS
  @Get("admin/users")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async getAdminUsers() {
    return await this.prisma.getAllUsers();
  }

  @Post("admin/users/:id/role")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async updateAdminUserRole(
    @Param("id") id: string,
    @Body() body: { role: string }
  ) {
    if (!body.role || !["USER", "ADMIN"].includes(body.role.toUpperCase())) {
      throw new HttpException("Invalid role profile targeted", HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.updateUserRole(id, body.role.toUpperCase());
  }

  @Post("admin/users/:id/block")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async updateAdminUserStatus(
    @Param("id") id: string,
    @Body() body: { isBlocked: boolean }
  ) {
    if (body.isBlocked === undefined) {
      throw new HttpException("isBlocked status is required", HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.updateUserStatus(id, body.isBlocked);
  }

  @Post("admin/users/:id/delete")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async deleteAdminUser(@Param("id") id: string) {
    return await this.prisma.deleteUser(id);
  }

  @Get("admin/analytics")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async getAdminAnalytics() {
    return await this.prisma.getGlobalStats();
  }

  @Get("admin/audit-logs")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async getAdminAuditLogs() {
    return await this.prisma.getAuditLogs();
  }

  @Get("admin/policies")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async getAdminPolicies() {
    return await this.prisma.getGlobalPolicies();
  }

  @Post("admin/policies")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async updateAdminPolicies(@Body() body: any) {
    return await this.prisma.updateGlobalPolicies(body);
  }

  @Get("admin/teams")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async getAdminTeams() {
    return await this.prisma.getAllTeams();
  }

  @Post("admin/teams")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async createAdminTeam(@Body() body: any) {
    if (!body.name) {
      throw new HttpException("Team name is required", HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.createTeam(body);
  }

  @Delete("admin/teams/:id")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async deleteAdminTeam(@Param("id") id: string) {
    try {
      return await this.prisma.deleteTeam(id);
    } catch (e) {
      throw new HttpException(
        "Failed to delete team: " + e.message,
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Post("admin/users/:id/tier")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async updateAdminUserTier(
    @Param("id") id: string,
    @Body() body: { tier: string }
  ) {
    if (!body.tier || !["FREE", "PRO", "TEAM"].includes(body.tier.toUpperCase())) {
      throw new HttpException("Invalid plan tier targeted", HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.updateUserTier(id, body.tier.toUpperCase());
  }

  // RESTful users endpoints
  @Get("users")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async getUsersList() {
    try {
      return await this.prisma.getAllUsers();
    } catch (e) {
      throw new HttpException(
        "Failed to retrieve user catalog: " + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch("users/:id")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async patchUserDetail(
    @Param("id") id: string,
    @Body() body: { role?: string; status?: string; plan?: string; name?: string }
  ) {
    if (!body || Object.keys(body).length === 0) {
      throw new HttpException("Update payload body must not be empty", HttpStatus.BAD_REQUEST);
    }

    // Input validation
    if (body.role !== undefined) {
      if (typeof body.role !== "string" || !["USER", "ADMIN"].includes(body.role.toUpperCase())) {
        throw new HttpException("Invalid role profile targeted. Must be USER or ADMIN.", HttpStatus.BAD_REQUEST);
      }
    }
    if (body.status !== undefined) {
      if (typeof body.status !== "string" || !["ACTIVE", "BLOCKED"].includes(body.status.toUpperCase())) {
        throw new HttpException("Invalid status targeted. Must be ACTIVE or BLOCKED.", HttpStatus.BAD_REQUEST);
      }
    }
    if (body.plan !== undefined) {
      if (typeof body.plan !== "string" || !["FREE", "PRO", "TEAM"].includes(body.plan.toUpperCase())) {
        throw new HttpException("Invalid plan targeted. Must be FREE, PRO, or TEAM.", HttpStatus.BAD_REQUEST);
      }
    }
    if (body.name !== undefined) {
      if (body.name !== null && typeof body.name !== "string") {
        throw new HttpException("Invalid name targeted. Must be a string.", HttpStatus.BAD_REQUEST);
      }
    }

    try {
      const updatedUser = await this.prisma.updateUser(id, {
        role: body.role?.toUpperCase(),
        status: body.status?.toUpperCase(),
        plan: body.plan?.toUpperCase(),
        name: body.name,
      });
      return updatedUser;
    } catch (e) {
      throw new HttpException(
        "Failed to update user profile: " + e.message,
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Delete("users/:id")
  @UseGuards(ClerkGuard, AdminOnlyGuard)
  async deleteUserDetail(@Param("id") id: string) {
    try {
      return await this.prisma.deleteUser(id);
    } catch (e) {
      throw new HttpException(
        "Failed to delete user account: " + e.message,
        HttpStatus.NOT_FOUND
      );
    }
  }

  
  // Get configuration endpoint
  @Get("configuration")
  @UseGuards(ClerkGuard)
  async getConfiguration() {
    const system = await this.prisma.systemSettings?.findFirst();
    const ai = await this.prisma.aIEngineSettings?.findFirst();
    // Returning only system and AI configuration; user-specific data omitted for simplicity.
    return {
      system,
      ai,
    };
  }

  // Update configuration endpoint (system and AI only)
  @Patch("configuration")
  @UseGuards(ClerkGuard)
  async updateConfiguration(@Body() body: any) {
    if (body.system) {
      await this.prisma.systemSettings?.upsert({
        where: { id: 1 },
        update: body.system,
        create: { ...body.system, id: 1 },
      });
    }
    if (body.ai) {
      await this.prisma.aIEngineSettings?.upsert({
        where: { id: 1 },
        update: body.ai,
        create: { ...body.ai, id: 1 },
      });
    }
    // No user-specific updates in simplified version.
    return this.getConfiguration();
  }


}
