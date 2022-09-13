import { readFileSync } from "fs";

export interface Configuration {
  credentials: {
    keyFile: string;
  };
  sheet: {
    spreadsheetId: string;
    range: string;
  };
  notification: {
    email: {
      transport: {
        host: string;
        port: number;
      };
      header: {
        from: string;
        to: string;
        cc?: string;
        subject?: string;
      };
      message: {
        templateFile: string;
        fields: { [key: string]: string };
      };
    };
  };
}

export function readConfig(filename: string | string[]): Configuration[] {
  const fileNames = Array.isArray(filename) ? filename : [filename];

  return fileNames.flatMap((file) => {
    const config = readFileSync(file, "utf8");
    return parseConfig(config);
  });
}

export function parseConfig(configJSON: string): Configuration[] {
  return JSON.parse(configJSON);
}
