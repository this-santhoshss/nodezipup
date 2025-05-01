import { readFileSync } from 'fs';
import path from 'path';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { expandPatterns } from './expandPatterns';
import { createZip } from './zip';

export interface Args {
  zipFile: string;
  cwd: string;
  patterns: string[];
}

async function runCli(): Promise<void> {
  const argv = yargs(hideBin(process.argv));
  const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

  const args = argv
    .scriptName('zipup')
    .usage('$0 <zipFile> <patterns..> [options]')
    .command('$0 <zipFile> <patterns..>', 'Create a zip file from matched patterns', (yargs) =>
      yargs
        .positional('zipFile', {
          describe: 'Path of the output zip file',
          type: 'string',
          demandOption: true,
        })
        .positional('patterns', {
          describe: 'Glob patterns to match files',
          type: 'string',
          array: true,
          demandOption: true,
        }),
    )
    .option('cwd', {
      type: 'string',
      describe: 'Base directory to start matching from',
      default: process.cwd(),
    })
    .check((argv) => {
      if (!(argv.zipFile as string).endsWith('.zip')) {
        throw new Error('Output file must have a .zip extension.');
      }
      if (!Array.isArray(argv.patterns) || argv.patterns.length === 0) {
        throw new Error('At least one pattern must be provided.');
      }
      return true;
    })
    .help()
    .version(`zipup version ${pkg.version}\n`)
    .alias('v', 'version')
    .alias('h', 'help')
    .parse() as unknown as Args;

  const cwd = path.resolve(args.cwd);
  const zipPath = path.resolve(cwd, args.zipFile as string);
  const patterns = args.patterns;

  const files = await expandPatterns(patterns, cwd);

  if (files.length === 0) {
    console.warn('⚠️ No files matched the given patterns.');
    return;
  }
  console.log(`📦 Creating zip: ${zipPath}`);
  await createZip(zipPath, files, cwd);
  console.log('✅ Zip created successfully!');
}

export { runCli };
