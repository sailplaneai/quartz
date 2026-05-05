import { QuartzTransformerPlugin } from "../types"

const confidentialRegex = /%%([\s\S]*?)%%/g
// Match a leading YAML frontmatter block: "---\n...\n---\n". The body
// transformer runs only on what follows. Frontmatter is metadata, not
// content; transformers that mutate text (this one, OFM highlights, etc.)
// would otherwise corrupt YAML when an author legitimately uses %% or ==
// inside a frontmatter value.
const frontmatterRegex = /^---\r?\n[\s\S]*?\r?\n---\r?\n/

export const Confidential: QuartzTransformerPlugin = () => {
  return {
    name: "Confidential",
    textTransform(_ctx, src) {
      const fmMatch = src.match(frontmatterRegex)
      const fmEnd = fmMatch ? fmMatch[0].length : 0
      const head = src.slice(0, fmEnd)
      const body = src.slice(fmEnd)
      const transformed = body.replace(confidentialRegex, (_match, inner: string) => {
        if (inner.includes("\n")) {
          return `\n\n<div class="confidential">\n\n${inner.trim()}\n\n</div>\n\n`
        }
        return `<span class="confidential">${inner}</span>`
      })
      return head + transformed
    },
  }
}
