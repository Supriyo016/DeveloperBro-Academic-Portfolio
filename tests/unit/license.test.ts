import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { LICENSE_TEXT } from "@/content/license";

describe("license", () => {
  it("keeps the LICENSE file identical to the text shown on the site", () => {
    expect(readFileSync("LICENSE", "utf8").replace(/\r\n/g, "\n")).toBe(LICENSE_TEXT);
  });

  it("is proprietary in the package metadata too", () => {
    expect(JSON.parse(readFileSync("package.json", "utf8")).license).toBe("UNLICENSED");
  });
});
