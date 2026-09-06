import { describe, it, expect } from "vitest"
import { listTemplates } from "../templates.js"
import { scaffold } from "../scaffold.js"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

describe("listTemplates", () => {
  it("returns all 4 templates", () => {
    const templates = listTemplates()
    expect(templates).toHaveLength(4)
    const ids = templates.map((t) => t.id)
    expect(ids).toContain("dapp")
    expect(ids).toContain("svm-program")
    expect(ids).toContain("zk-circuit")
    expect(ids).toContain("sdk-package")
  })
})

describe("scaffold", () => {
  it("creates target directory and package.json for dapp template", async () => {
    const tmp = await mkdtemp(join(tmpdir(), "axio-create-app-test-"))
    try {
      await scaffold({ targetDir: tmp, projectName: "my-dapp", template: "dapp" })
      const { readFile } = await import("node:fs/promises")
      const raw = await readFile(join(tmp, "my-dapp", "package.json"), "utf-8")
      const pkg = JSON.parse(raw) as { name: string; version: string }
      expect(pkg.name).toBe("my-dapp")
      expect(pkg.version).toBe("0.1.0")
    } finally {
      await rm(tmp, { recursive: true, force: true })
    }
  })

  it("throws on unknown template", async () => {
    const tmp = await mkdtemp(join(tmpdir(), "axio-create-app-test-"))
    try {
      await expect(
        scaffold({ targetDir: tmp, projectName: "x", template: "unknown" as never })
      ).rejects.toThrow("Unknown template")
    } finally {
      await rm(tmp, { recursive: true, force: true })
    }
  })
})
