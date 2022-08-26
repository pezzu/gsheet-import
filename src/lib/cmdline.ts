export function getConfigFilesFromCmdLine(argv: string[]) : string [] {
  return argv.slice(2);
}