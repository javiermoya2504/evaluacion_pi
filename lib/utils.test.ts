import { describe, expect, it } from "vitest"

import { cn } from "./utils"

describe("cn", () => {
  it("combines conditional class names", () => {
    expect(cn("base", false && "hidden", { active: true })).toBe(
      "base active",
    )
  })

  it("keeps the last conflicting Tailwind class", () => {
    expect(cn("px-2", "px-4", "text-sm", "text-lg")).toBe(
      "px-4 text-lg",
    )
  })
})
