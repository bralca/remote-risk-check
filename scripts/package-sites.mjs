import { copyFile, cp, mkdir, readdir, writeFile } from "node:fs/promises";

const outputDirectory = process.env.NEXT_OUTPUT_DIR ?? "dist";

if (process.env.GITHUB_PAGES === "true") {
  await writeFile(`${outputDirectory}/.nojekyll`, "");
} else {
  const clientDirectory = `${outputDirectory}/dist/client`;
  await mkdir(`${outputDirectory}/server`, { recursive: true });
  await mkdir(`${outputDirectory}/dist/server`, { recursive: true });
  await mkdir(clientDirectory, { recursive: true });
  await mkdir(`${outputDirectory}/.openai`, { recursive: true });
  await copyFile("server/index.js", `${outputDirectory}/server/index.js`);
  await copyFile(
    "server/index.js",
    `${outputDirectory}/dist/server/index.js`
  );
  const outputEntries = await readdir(outputDirectory, {
    withFileTypes: true
  });
  for (const entry of outputEntries) {
    if ([".openai", "dist", "server"].includes(entry.name)) continue;
    await cp(
      `${outputDirectory}/${entry.name}`,
      `${clientDirectory}/${entry.name}`,
      { recursive: true }
    );
  }
  await copyFile(
    ".openai/hosting.json",
    `${outputDirectory}/.openai/hosting.json`
  );
}
