import { createClient } from "bedrock-protocol";

export class BedrockAgent {
  constructor(config) {
    this.config = config;
    this.client = null;
    this.connected = false;
    this.connecting = false;
    this.lastError = null;
    this.lastEvent = null;
  }

  async connect() {
    if (this.connected) {
      return {
        connected: true,
        host: this.config.minecraft.host,
        port: this.config.minecraft.port
      };
    }

    if (this.connecting) {
      return {
        connected: false,
        connecting: true,
        host: this.config.minecraft.host,
        port: this.config.minecraft.port
      };
    }

    this.connecting = true;
    this.lastError = null;
    this.lastEvent = "connecting";

    try {
      console.log(
        `[Minecraft] connecting to ${this.config.minecraft.host}:${this.config.minecraft.port}`
      );

      this.client = createClient({
        host: this.config.minecraft.host,
        port: this.config.minecraft.port,
        version: this.config.minecraft.version
      });

      await new Promise((resolve, reject) => {
        let settled = false;

        const finish = (fn, value) => {
          if (settled) return;
          settled = true;
          fn(value);
        };

        this.client.once("connect", () => {
          this.connected = true;
          this.connecting = false;
          this.lastEvent = "connected";
          this.lastError = null;

          console.log("[Minecraft] connected");

          finish(resolve, true);
        });

        this.client.once("error", (error) => {
          this.connected = false;
          this.lastError =
            error?.message || String(error);
          this.lastEvent = "error";

          console.error(
            "[Minecraft] error:",
            this.lastError
          );

          finish(reject, error);
        });

        this.client.once("disconnect", (packet) => {
          this.connected = false;
          this.lastEvent = "disconnected";

          console.log(
            "[Minecraft] disconnected",
            packet
          );

          if (!settled) {
            finish(
              reject,
              new Error("Disconnected before connection completed")
            );
          }
        });
      });

      return {
        connected: true,
        host: this.config.minecraft.host,
        port: this.config.minecraft.port
      };

    } catch (error) {
      this.connected = false;
      this.connecting = false;

      this.lastError =
        error?.message || String(error);

      throw error;
    }
  }

  status() {
    return {
      connected: this.connected,
      connecting: this.connecting,
      host: this.config.minecraft.host,
      port: this.config.minecraft.port,
      version: this.config.minecraft.version,
      lastEvent: this.lastEvent,
      lastError: this.lastError
    };
  }
}
