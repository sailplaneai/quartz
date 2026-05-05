import test, { describe } from "node:test"
import assert from "node:assert"
import { Confidential } from "./confidential"

const transform = (src: string): string => {
  const plugin = Confidential()
  return plugin.textTransform!({} as never, src) as string
}

describe("Confidential transformer", () => {
  test("S1: inline match wraps in <span>", () => {
    const out = transform("Lead with %% $5M ARR %% framing")
    assert.strictEqual(out, 'Lead with <span class="confidential"> $5M ARR </span> framing')
  })

  test("S2: multi-line match wraps in <div> with surrounding blank lines", () => {
    const src = "before\n\n%%\nfoo\nbar\n%%\n\nafter"
    const out = transform(src)
    assert.match(out, /<div class="confidential">/)
    assert.match(out, /foo\nbar/)
    assert.doesNotMatch(out, /%%/)
    // CommonMark HTML block type 6 requires blank lines around the tags
    assert.match(out, /\n\n<div class="confidential">\n\n/)
    assert.match(out, /\n\n<\/div>\n\n/)
  })

  test("S4: source without %% passes through unchanged", () => {
    const src = "plain markdown with no markers"
    assert.strictEqual(transform(src), src)
  })

  test("B4: unmatched single delimiter passes through unchanged", () => {
    assert.strictEqual(transform("%%foo without close"), "%%foo without close")
    assert.strictEqual(transform("foo without open%%"), "foo without open%%")
  })

  test("B5: adjacent inline blocks each transform independently", () => {
    const out = transform("%%a%% middle %%b%%")
    assert.strictEqual(
      out,
      '<span class="confidential">a</span> middle <span class="confidential">b</span>',
    )
  })

  test("B6: frontmatter is preserved verbatim, not transformed", () => {
    const src = `---
title: "Note about %%confidential%% blocks"
aliases: ["Note about %%confidential%% blocks"]
---

Body has %% real %% content.`
    const out = transform(src)
    // Frontmatter values stay exactly as written — YAML stays parseable.
    assert.match(out, /title: "Note about %%confidential%% blocks"/)
    assert.match(out, /aliases: \["Note about %%confidential%% blocks"\]/)
    // Body is transformed.
    assert.match(out, /<span class="confidential"> real <\/span>/)
  })
})
