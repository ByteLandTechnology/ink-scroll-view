import fs from "fs";
import path from "path";

const CONFIG = {
  source: {
    root: path.normalize(path.join(process.cwd(), "..")),
    docs: path.join(process.cwd(), "..", "docs"),
    readme: path.join(process.cwd(), "..", "README.md"),
  },
  target: {
    root: path.join(process.cwd(), "app/docs"),
    api: path.join(process.cwd(), "app/docs/api"),
    media: path.join(process.cwd(), "public/docs/_media"),
    meta: path.join(process.cwd(), "app/_meta.global.ts"),
  },
  urlPrefix: "/docs",
};

class DocsSyncer {
  private ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  private copyDir(src: string, dest: string) {
    if (!fs.existsSync(src)) return;
    this.ensureDir(dest);
    for (const item of fs.readdirSync(src)) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      const stat = fs.statSync(srcPath);
      if (stat.isDirectory()) {
        this.copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  private cleanDir(dir: string) {
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  }

  private cleanFile(file: string) {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }

  private processLinks(content: string): string {
    // Fix media paths
    let processed = content.replace(
      /(\.?\/?)?docs\/_media\//g,
      "/docs/_media/",
    );

    // Fix markdown links
    return processed.replace(
      /(!?\[[^\]]+\]\()([^)]+?)(\))/g,
      (match, prefix, href, suffix) => {
        if (prefix.startsWith("!") || href.match(/^(http|#|\/)/)) return match;

        let target = href.replace(/\.md$/, "");

        // Handle path prefixes
        if (target.startsWith("docs/")) target = target.substring(5);
        else if (target.startsWith("./docs/")) target = target.substring(7);

        // Handle README specifically
        if (target.endsWith("README")) target = target.slice(0, -6);
        else if (path.basename(target).toLowerCase() === "readme") {
          target = path.dirname(target);
          if (target === ".") target = "";
        }

        // Remove trailing slash
        if (target.endsWith("/")) target = target.slice(0, -1);

        const finalUrl = target
          ? `${CONFIG.urlPrefix}/${target}`
          : CONFIG.urlPrefix;
        return `${prefix}${finalUrl}${suffix}`;
      },
    );
  }

  private convertFile(srcPath: string, destDir: string, destName?: string) {
    const filename = path.basename(srcPath);
    const nameWithoutExt = path.basename(srcPath, ".md");
    let title: string;
    let newPath: string;

    if (nameWithoutExt.toLowerCase() === "readme") {
      const parentDir = path.basename(path.dirname(srcPath));
      title =
        parentDir === "api"
          ? "API Reference"
          : parentDir.charAt(0).toUpperCase() + parentDir.slice(1);

      // Special case for root README
      if (srcPath === CONFIG.source.readme) title = "Getting Started";

      newPath = path.join(destDir, "page.mdx");
    } else {
      title = nameWithoutExt;
      const newDir = path.join(destDir, nameWithoutExt);
      this.ensureDir(newDir);
      newPath = path.join(newDir, "page.mdx");
    }

    // Override filename if provided
    if (destName) {
      newPath = path.join(destDir, destName);
    }

    let content = fs.readFileSync(srcPath, "utf-8");
    content = this.processLinks(content);

    // Add frontmatter
    // Add frontmatter
    const frontmatter = [
      "---",
      `title: ${title}`,
      nameWithoutExt.toLowerCase() === "readme" ? "asIndexPage: true" : "",
      "---",
    ]
      .filter(Boolean)
      .join("\n");

    fs.writeFileSync(newPath, frontmatter + "\n\n" + content);
    console.log(
      `Converted: ${filename} -> ${path.relative(CONFIG.target.root, newPath)}`,
    );
  }

  private processDirectory(srcDir: string, destDir: string) {
    if (!fs.existsSync(srcDir)) return;
    this.ensureDir(destDir);

    for (const item of fs.readdirSync(srcDir)) {
      const srcPath = path.join(srcDir, item);
      const stat = fs.statSync(srcPath);

      if (stat.isDirectory()) {
        const newDest = path.join(destDir, item);
        this.processDirectory(srcPath, newDest);
      } else if (item.endsWith(".md")) {
        this.convertFile(srcPath, destDir);
      }
    }
  }

  private generateDirectoryMeta(dir: string): void {
    if (!fs.existsSync(dir)) return;

    const items: Record<string, any> = {};

    for (const item of fs.readdirSync(dir)) {
      if (item.startsWith("_") || item.startsWith(".")) continue;

      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        const hasPage = fs.existsSync(path.join(fullPath, "page.mdx"));
        if (hasPage) {
          let title = item
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

          if (item === "api") title = "API Reference";

          items[item] = title;
        }
        // Recurse into subdirectories
        this.generateDirectoryMeta(fullPath);
      }
    }

    // Only generate _meta.ts if there are items
    if (Object.keys(items).length > 0) {
      const metaPath = path.join(dir, "_meta.ts");
      const content = `export default ${JSON.stringify(items, null, 2)};\n`;
      fs.writeFileSync(metaPath, content);
      console.log(`Generated ${path.relative(CONFIG.target.root, metaPath)}`);
    }
  }

  public run() {
    console.log("=== Syncing Documentation ===");

    this.ensureDir(CONFIG.target.root);

    // 1. Sync README -> Getting Started
    if (fs.existsSync(CONFIG.source.readme)) {
      this.convertFile(CONFIG.source.readme, CONFIG.target.root, "page.mdx");
    }

    // 2. Sync API Docs
    this.cleanDir(CONFIG.target.api);
    this.processDirectory(
      path.join(CONFIG.source.docs, "api"),
      CONFIG.target.api,
    );
    console.log("Copied API docs -> docs/api/");

    // 3. Sync Media
    this.cleanDir(CONFIG.target.media);
    this.copyDir(path.join(CONFIG.source.docs, "_media"), CONFIG.target.media);
    console.log("Copied _media -> public/docs/_media/");

    // 4. Generate directory meta files for sidebar
    this.generateDirectoryMeta(CONFIG.target.root);

    // 5. Generate global meta for top navbar
    const meta = {
      index: { title: "Home", type: "page" },
      docs: { title: "Docs", type: "doc" },
      showcase: { title: "Showcase", type: "page" },
    };

    const content = `export default ${JSON.stringify(meta, null, 2)};\n`;
    fs.writeFileSync(CONFIG.target.meta, content);
    console.log("Generated _meta.global.ts");
    console.log("=== Documentation sync complete ===");
  }
}

export function sync() {
  new DocsSyncer().run();
}
