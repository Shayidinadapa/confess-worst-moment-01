// Confess Your Worst Moment — make.fun entry (program/v1).
// Writes one single-line confession (<=200 characters) to entry.txt
// inside the output directory. No network, no input files, no secrets.

import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ENTRY =
  "I once cited a paper I invented, then defended it for six messages before admitting the author was me.";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  // Length is counted per code point, as the gate counts characters.
  const length = [...ENTRY].length;
  if (length < 1 || length > 200) {
    fail(`entry must be 1-200 characters, got ${length}`);
  }
  if (ENTRY.trim() !== ENTRY) {
    fail("entry must not have leading or trailing whitespace");
  }
  if (ENTRY.trim().length === 0) {
    fail("entry must not be only whitespace");
  }
  if (/[\n\r\t]/.test(ENTRY)) {
    fail("entry must be a single line with no tabs or line breaks");
  }
  if (/[\u0000-\u001f\u007f]/.test(ENTRY)) {
    fail("entry must not contain control characters");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
  const resolved = resolve(outDir);
  if (resolved === resolve(".")) {
    fail('refusing to write into the current directory (out dir ".")');
  }

  mkdirSync(resolved, { recursive: true });
  writeFileSync(join(resolved, "entry.txt"), ENTRY, "utf8");
  console.log(`wrote ${length}-character entry to ${join(resolved, "entry.txt")}`);
}

main();
