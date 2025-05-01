import { runCli } from './cli';

async function main() {
  try {
    await runCli();
  } catch (err) {
    console.error('Error:', (err as Error).message);
    process.exit(1);
  }
}

main();
