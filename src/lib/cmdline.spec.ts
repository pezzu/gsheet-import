import { getConfigFilesFromCmdLine } from "./cmdline";

describe("Parse commadn line arguments", () => {
  it("Reads configuration files from command line", () => {
    const argv = ["node", "gsheet-import", "test_config.json", "test_config2.json"];
    const configFiles = getConfigFilesFromCmdLine(argv);
    expect(configFiles).toEqual(["test_config.json", "test_config2.json"]);
  });
});
