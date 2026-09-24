import process from "node:process";

export const config = {
  port: Number(process.env.PORT || 8080),

  astra: {
    name: process.env.ASTRA_NAME || "Astra",
    timezone: process.env.TIMEZONE || "Asia/Kolkata",
    playStart: process.env.ASTRA_PLAY_START || "18:00",
    playEnd: process.env.ASTRA_PLAY_END || "23:00"
  },

  minecraft: {
    host: process.env.MC_HOST || "Void_SMP-6MTk.aternos.me",
    port: Number(process.env.MC_PORT || 63005),
    version: process.env.MC_VERSION || "1.26.51.1"
  },

  apiKey: process.env.JARVIS_API_KEY || ""
};
