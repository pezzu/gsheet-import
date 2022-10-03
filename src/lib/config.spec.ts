import { writeFileSync } from "fs";
import { parseConfig, readConfig } from "./config";
import { nextName, cleanup } from "../../tests/lib/tmpname";


const CONFIG_STRING = `
{
  "credentials": {
    "keyFile": "test_credentials.json"
  },
  "sheet": {
    "spreadsheetId": "1n5mK1NpGXcEsDo9N2ybFFTOlTC39KVEq2FUex3XRG7Q",
    "range": "Class Data!A2:E5"
  },
  "notification": {
    "email": {
      "transport": {
        "host": "smtp.gmail.com",
        "port": 465
      },
      "header": {
        "from": "user@domain.com",
        "to": "another@domain.com",
        "cc": "usertoo@domain.com",
        "subject": "Class Data"
      }
    },
    "message": {
      "templateFile": "./templates/email.html",
      "fields": {
        "name": "Alexandra"
      }
    }
  }
}
`;

const CONFIG_JSON = {
  "credentials": {
    "keyFile": "test_credentials.json"
  },
  "sheet": {
    "spreadsheetId": "1n5mK1NpGXcEsDo9N2ybFFTOlTC39KVEq2FUex3XRG7Q",
    "range": "Class Data!A2:E5"
  },
  "notification": {
    "email": {
      "transport": {
        "host": "smtp.gmail.com",
        "port": 465
      },
      "header": {
        "from": "user@domain.com",
        "to": "another@domain.com",
        "cc": "usertoo@domain.com",
        "subject": "Class Data"
      }
    },
    "message": {
      "templateFile": "./templates/email.html",
      "fields": {
        "name": "Alexandra"
      }
    }
  }
}

describe("Parses configuration files", () => {
  afterAll(async () => cleanup());

  it("Should parse a configuration from JSON string", () => {
    const config = parseConfig(CONFIG_STRING);
    expect(config).toEqual(CONFIG_JSON);
  });

  it("Should parse a configuration from JSON file", () => {
    const confgiFile = nextName();
    writeFileSync(confgiFile, CONFIG_STRING);
    const config = readConfig(confgiFile);
    expect(config).toEqual([CONFIG_JSON]);
  });

  it("Should parse a configuration from multiple JSON files", () => {
    const confgiFile = nextName();
    writeFileSync(confgiFile, CONFIG_STRING);
    const config = readConfig([confgiFile, confgiFile]);
    expect(config).toEqual([CONFIG_JSON, CONFIG_JSON]);
  });

  it.skip("Throws if validation fails", () => {
    const configSpreadSheetId = CONFIG_JSON;
    configSpreadSheetId.sheet.spreadsheetId = "";
    expect(() => {
      parseConfig(JSON.stringify(configSpreadSheetId));
    }).toThrowError(/spreadsheetId/);

    const configRange = CONFIG_JSON;
    configRange.sheet.range = "";
    expect(() => {
      parseConfig(JSON.stringify(configRange));
    }).toThrowError(/range/);

    const configCredentials = CONFIG_JSON;
    (configCredentials as any).credentials = undefined;
    expect(() => {
      parseConfig(JSON.stringify(configCredentials));
    }).toThrowError(/credentials/);

    const configNotification = CONFIG_JSON;
    (configNotification as any).notification = undefined;
    expect(() => {
      parseConfig(JSON.stringify(configNotification));
    }).toThrowError(/notification/);

    const configMessage = CONFIG_JSON;
    (configMessage as any).notification.message = undefined;
    expect(() => {
      parseConfig(JSON.stringify(configMessage));
    }).toThrowError(/message/);
  });
});
