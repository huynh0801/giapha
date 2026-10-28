import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("vercel.json exists and configures Singapore sin1 region", () => {
  assert.ok(fs.existsSync("vercel.json"), "vercel.json must exist in root");
  const vercelConfig = JSON.parse(read("vercel.json"));
  assert.deepEqual(vercelConfig.regions, ["sin1"], "Vercel region must be sin1");
});

test("next.config.ts specifies optimizePackageImports for heavy libraries", () => {
  const nextConfig = read("next.config.ts");
  assert.match(nextConfig, /optimizePackageImports/, "next.config.ts must configure optimizePackageImports");
  assert.match(nextConfig, /lucide-react/, "optimizePackageImports must include lucide-react");
  assert.match(nextConfig, /@xyflow\/react/, "optimizePackageImports must include @xyflow/react");
});
