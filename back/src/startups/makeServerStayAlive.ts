import keepTheServerAlive from "../corn.ts";
import cron from "node-cron";

export default function makeServerStayAlive() {
  if (process.env.NODE_ENV === "production")
    cron.schedule(process.env.HIT_THE_SERVER_EVERY || "*/14 * * * *", () => {
      keepTheServerAlive();
    });
}
