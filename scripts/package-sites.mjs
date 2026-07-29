import { copyFile, mkdir, writeFile } from "node:fs/promises";

const outputDirectory = process.env.NEXT_OUTPUT_DIR ?? "dist";

if (process.env.GITHUB_PAGES === "true") {
  await writeFile(`${outputDirectory}/.nojekyll`, "");
} else {
  await mkdir(`${outputDirectory}/server`, { recursive: true });
  await mkdir(`${outputDirectory}/dist/server`, { recursive: true });
  await mkdir(`${outputDirectory}/.openai`, { recursive: true });
  await copyFile("server/index.js", `${outputDirectory}/server/index.js`);
  await copyFile(
    "server/index.js",
    `${outputDirectory}/dist/server/index.js`
  );
  await copyFile(
    ".openai/hosting.json",
    `${outputDirectory}/.openai/hosting.json`
  );
}
