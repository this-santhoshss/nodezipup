import { glob } from 'glob';

export async function expandPatterns(patterns: string[], workdir?: string): Promise<string[]> {
  const results = await Promise.all(
    patterns.map((p) =>
      glob(p, {
        cwd: workdir,
        nodir: true,
        absolute: true,
      }),
    ),
  );
  const files = [...new Set(results.flat())];
  return files;
}
