export class AstraAgent {
  constructor(config, minecraft) {
    this.config = config;
    this.minecraft = minecraft;

    this.state = {
      name: config.astra.name,
      mode: "resting",
      connected: false,
      currentTask: "Waiting for play time",
      lastCommand: null,
      health: null,
      food: null,
      position: null
    };
  }

  getStatus() {
    return {
      ...this.state,
      server: {
        host: this.config.minecraft.host,
        port: this.config.minecraft.port,
        version: this.config.minecraft.version
      },
      schedule: {
        timezone: this.config.astra.timezone,
        playStart: this.config.astra.playStart,
        playEnd: this.config.astra.playEnd
      }
    };
  }

  async chat(message) {
    const text = String(message || "").trim();

    if (!text) {
      return {
        reply: "I didn't receive a command."
      };
    }

    this.state.lastCommand = text;

    const lower = text.toLowerCase();

    if (lower.includes("status")) {
      return {
        reply: `I'm ${this.state.mode}. ${this.state.currentTask}.`,
        status: this.getStatus()
      };
    }

    if (lower.includes("join")) {
      this.state.currentTask = "Joining Void SMP";
      await this.minecraft.connect();

      return {
        reply: "I'm preparing to join Void SMP.",
        task: "join_server"
      };
    }

    this.state.currentTask = text;

    return {
      reply: `Understood. I'll make this my current objective: ${text}`,
      task: text
    };
  }

  setSchedule(playStart, playEnd) {
    this.config.astra.playStart = playStart;
    this.config.astra.playEnd = playEnd;

    return {
      timezone: this.config.astra.timezone,
      playStart,
      playEnd
    };
  }
}
