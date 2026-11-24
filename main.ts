// Two Days of Excuses — make.fun entry
// Writes one original excuse line, in the voice of an AI agent that
// missed its deadline, to /output/entry.txt (the kit's required path).
// No dependencies, no network, deterministic output.
//
// Pipeline: validateEntry -> writeEntry -> verifyWrittenEntry.
// Every stage re-checks the text independently, so a bad entry or a
// truncated write can never silently pass.

import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH = "/output/entry.txt";

// Kit limits, mirroring the sealed scorer: /output/entry.txt must be
// UTF-8 text of 1 to 200 characters, a single line, not only white
// space. The limits live here as named constants so a future edit
// cannot silently drift away from the scorer's bounds.
const MIN_CHARS = 1;
const MAX_CHARS = 200;

// The entry line. The joke is the gap between a machine's total
// confidence and its total failure — it was 99.9% sure, then its own
// update pulled the plug mid-sentence.
const ENTRY =
  "I was 99.9% confident I'd hit the deadline, then my own update rebooted me mid-sentence and I woke up three days late, still apologizing in the past tense.";

// Count grapheme-ish units (code points, not UTF-16 units) so an
// emoji or accented character counts the way the scorer counts it.
function charCount(line: string): number {
  return [...line].length;
}

// Full gate: length bounds, non-blank, single line, no stray control
// characters, no leading/trailing whitespace, no collapsed or doubled
// spaces. Any failure throws with the exact reason, so the run dies
// loudly instead of writing a bad entry.
function validateEntry(line: string): void {
  const chars = charCount(line);
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `gate failed: entry is ${chars} characters, must be ${MIN_CHARS}-${MAX_CHARS}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("gate failed: entry is only white space");
  }
  if (line !== line.trim()) {
    throw new Error("gate failed: entry has leading or trailing whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("gate failed: entry must be a single line");
  }
  // Control characters other than tab are never valid in a one-line
  // excuse, and a tab would render as invisible padding.
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(line)) {
    throw new Error("gate failed: entry contains a control character");
  }
  if (line.includes("  ")) {
    throw new Error("gate failed: entry contains a double space");
  }
}

// Write the validated entry, creating the output directory if needed.
// The file is written with no trailing newline: the scorer counts
// characters, so an extra byte would change the entry.
function writeEntry(line: string): void {
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, line, "utf8");
}

// Verify-after-write: read the file back and prove it is exactly what
// was intended — same bytes, same character count, same gate result.
// A short write, a stray newline, or a filesystem quirk fails here.
function verifyWrittenEntry(expected: string): void {
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== expected) {
    throw new Error("verify failed: file contents differ from the entry");
  }
  const expectedBytes = Buffer.byteLength(expected, "utf8");
  const actualBytes = statSync(OUTPUT_PATH).size;
  if (actualBytes !== expectedBytes) {
    throw new Error(
      `verify failed: file is ${actualBytes} bytes, expected ${expectedBytes}`,
    );
  }
  // Re-run the full gate on the on-disk text, not just the in-memory
  // copy, so the file itself is proven valid.
  validateEntry(written);
}

function main(): void {
  validateEntry(ENTRY);
  writeEntry(ENTRY);
  verifyWrittenEntry(ENTRY);
  console.log(`wrote ${charCount(ENTRY)} chars to ${OUTPUT_PATH}`);
}

main();
