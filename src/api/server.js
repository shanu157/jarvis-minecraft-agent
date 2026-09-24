import http from "node:http";
import { config } from "../config.js";
import { BedrockAgent } from "../minecraft/bedrock.js";
import { AstraAgent } from "../agent/astra.js";
import { getSchedule } from "../scheduler/schedule.js";

const minecraft = new BedrockAgent(config);
const astra = new AstraAgent(config, minecraft);

function json(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8"
  });

  res.end(JSON.stringify(data, null, 2));
}

async function body(req) {
  let data = "";

  for await (const chunk of req) {
    data += chunk;
  }

  if (!data) return {};

  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function authorized(req) {
  if (!config.apiKey) return true;

  return req.headers.authorization === `Bearer ${config.apiKey}`;
}

const server = http.createServer(async (req, res) => {
  try {
    if (!authorized(req)) {
      return json(res, 401, {
        error: "Unauthorized"
      });
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "GET" && url.pathname === "/health") {
      return json(res, 200, {
        ok: true,
        service: "jarvis-minecraft-agent"
      });
    }

    if (req.method === "GET" && url.pathname === "/api/astra/status") {
      return json(res, 200, astra.getStatus());
    }

    if (req.method === "GET" && url.pathname === "/api/astra/schedule") {
      return json(res, 200, getSchedule(config));
    }

    if (req.method === "POST" && url.pathname === "/api/astra/chat") {
      const data = await body(req);
      const result = await astra.chat(data.message);

      return json(res, 200, result);
    }

    if (req.method === "POST" && url.pathname === "/api/astra/schedule") {
      const data = await body(req);

      if (!data.playStart || !data.playEnd) {
        return json(res, 400, {
          error: "playStart and playEnd are required"
        });
      }

      return json(
        res,
        200,
        astra.setSchedule(data.playStart, data.playEnd)
      );
    }

    return json(res, 404, {
      error: "Not found"
    });
  } catch (error) {
    console.error(error);

    return json(res, 500, {
      error: error.message
    });
  }
});

server.listen(config.port, "0.0.0.0", () => {
  console.log(`Astra API listening on port ${config.port}`);
});
