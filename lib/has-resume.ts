import "server-only";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { RESUME_FILE } from "./contact";

/* exact-case match: existsSync says yes to Resume.pdf on macOS, but the server would 404 it */
export const HAS_RESUME = (() => {
  try {
    return readdirSync(join(process.cwd(), "public")).includes(RESUME_FILE);
  } catch {
    return false;
  }
})();
