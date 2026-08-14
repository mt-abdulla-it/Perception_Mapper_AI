import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

const NLP_ENGINE_URL = process.env.NLP_ENGINE_URL || "http://localhost:8000";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "telemetry",
})
export class TelemetryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.emit("status", { connected: true, timestamp: new Date().toISOString() });
  }

  handleDisconnect(client: Socket) {
    // Graceful disconnect cleanup
  }

  @SubscribeMessage("ping")
  handlePing(client: Socket): string {
    return "pong";
  }

  // Active listener for real-time keystroke-by-keystroke socket analysis stream
  @SubscribeMessage("analyze")
  async handleRealtimeAnalyze(client: Socket, @MessageBody() data: { text: string }): Promise<void> {
    if (!data || !data.text || !data.text.trim()) {
      client.emit("analysis_result", { success: false, error: "Text must not be empty" });
      return;
    }
    
    try {
      const response = await fetch(`${NLP_ENGINE_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: data.text }),
      });

      if (!response.ok) {
        throw new Error(`NLP Engine returned status ${response.status}`);
      }

      const result = await response.json();
      client.emit("analysis_result", {
        success: true,
        source: "WebSocket Live Stream",
        ...result,
      });
    } catch (err) {
      // Return beautiful fallback assessment if NLP sidecar is temporarily unreachable
      client.emit("analysis_result", {
        success: false,
        source: "WebSocket Mock Fallback",
        message: "Python NLP sidecar offline. Returning baseline assessment.",
        language: "English",
        scores: {
          sentiment: 50,
          objectivity: 80,
          biasIndex: 10,
        },
        tones: [
          { name: "Informative", score: 70, color: "from-blue-500 to-indigo-500" },
        ],
        biases: [],
      });
    }
  }

  // Broadcaster for real-time audit updates
  broadcastTelemetry(event: string, data: any) {
    if (this.server) {
      this.server.emit(event, {
        ...data,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
