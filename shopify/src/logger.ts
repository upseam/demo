type Level = "info" | "warn" | "error";

export function log(level: Level, message: string, fields: Record<string, unknown> = {}) {
  const line = JSON.stringify({ level, message, at: new Date().toISOString(), ...fields });
  if (level === "error") {
    console.error(line);
  } else {
    console.log(line);
  }
}
