import { buildServer } from "./app.ts";
import { config } from "./lib/config.ts";
import { log } from "./lib/logger.ts";

buildServer().listen(config.port, () => {
  log("info", "support backend listening", { port: config.port });
});
