import { createClient } from "bedrock-protocol";

export class BedrockAgent {
  constructor(config) {
    this.config = config;
    this.client = null;
    this.connected = false;
  }

  async connect() {
    if (this.connected) {
      return { connected: true };
    }

    /*
     * Authentication will be added after the cloud host is ready.
     *
     * IMPORTANT:
     * Do not put a Microsoft password, refresh token, or other
     * private credential into GitHub.
     */

    this.client = createClient({
      host: this.config.minecraft.host,
      port: this.config.minecraft.port,
      version: this.config.minecraft.version
    });

    this.client.on("connect", () => {
      this.connected = true;
      console.log("[Minecraft] connected");
    });

    this.client.on("disconnect", (packet) => {
      this.connected = false;
      console.log("[Minecraft] disconnected", packet);
    });

    this.client.on("error", (error) => {
      console.error("[Minecraft] error:", error);
    });

    return {
      connected: true,
      host: this.config.minecraft.host,
      port: this.config.minecraft.port
    };
  }

  status() {
    return {
      connected: this.connected,
      host: this.config.minecraft.host,
      port: this.config.minecraft.port,
      version: this.config.minecraft.version
    };
  }
}
