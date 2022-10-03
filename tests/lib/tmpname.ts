import { stat, unlink } from "fs/promises";
import * as crypto from "crypto";

const generatedNames: string[] = [];

export function nextName(): string {
  const next = crypto.randomBytes(16).toString("hex");
  generatedNames.push(next);
  return next;
}

export async function cleanup(): Promise<void[]> {
  return Promise.all(
    generatedNames.map(async (name) => {
      const stats = await stat(name).catch(() => null);
      if(stats && stats.isFile()) {
        return unlink(name);
      }
      return Promise.resolve();
    })
  );
}
