import path from 'path';

export interface ParsedArgs {
  zipPath: string;
  patterns: string[];
  cwd: string;
}

export function parseArgs(argv: string[]): ParsedArgs {
  const args = [...argv];
  const cwdFlagIndex = args.indexOf('--cwd');

  let cwd = process.cwd();
  if (cwdFlagIndex !== -1 && args[cwdFlagIndex + 1]) {
    const cwdArgv = args[cwdFlagIndex + 1];
    if (cwdArgv) {
      cwd = path.resolve(cwdArgv);
      args.splice(cwdFlagIndex, 2);
    }
  }

  if (args.length < 2) {
    throw new Error('Usage: zipcli <DEST.zip> <pattern...> [--cwd <dir>]');
  }

  const [zipPath, ...patterns] = args;
  if (!zipPath) {
    throw new Error('Usage: zipcli <DEST.zip> <pattern...> [--cwd <dir>]');
  }

  return {
    zipPath: path.resolve(cwd, zipPath),
    patterns,
    cwd,
  };
}
