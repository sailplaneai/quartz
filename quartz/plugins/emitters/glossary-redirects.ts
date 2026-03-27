import { FullSlug, resolveRelative } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import { slug as slugAnchor } from "github-slugger"

const GLOSSARY_SLUG = "src/glossary" as FullSlug

export const GlossaryRedirects: QuartzEmitterPlugin = () => ({
  name: "GlossaryRedirects",
  async *emit(ctx, content) {
    // Find the glossary file in processed content
    const glossaryEntry = content.find(([_tree, file]) => file.data.slug === GLOSSARY_SLUG)
    if (!glossaryEntry) return

    const [_tree, file] = glossaryEntry
    const src = String(file.value)

    // Build set of existing page slugs (lowercase) to skip terms that have real pages
    const existingSlugs = new Set(
      ctx.allSlugs.map((s) => s.split("/").pop()?.toLowerCase() ?? ""),
    )

    // Parse terms with their section anchors
    const terms = extractTerms(src)

    for (const { term, sectionAnchor } of terms) {
      // Skip terms that contain backticks or special chars (inline-code conventions)
      if (/[`<>]/.test(term)) continue

      // Slug matches what OFM + CrawlLinks produce for unresolved wikilinks:
      // [[Dell Technologies Capital]] → "Dell-Technologies-Capital" (spaces→hyphens, case preserved)
      const termSlug = term.replace(/\s/g, "-") as FullSlug

      // Skip if a page already exists with this filename (case-insensitive) —
      // CrawlLinks "shortest" will resolve to the real page directly
      if (existingSlugs.has(termSlug.toLowerCase())) continue
      const anchor = sectionAnchor ? `#${slugAnchor(sectionAnchor)}` : ""
      const redirUrl = resolveRelative(termSlug, GLOSSARY_SLUG) + anchor

      yield write({
        ctx,
        content: `
        <!DOCTYPE html>
        <html lang="en-us">
        <head>
        <title>${term} — Glossary</title>
        <link rel="canonical" href="${redirUrl}">
        <meta name="robots" content="noindex">
        <meta charset="utf-8">
        <meta http-equiv="refresh" content="0; url=${redirUrl}">
        </head>
        </html>
        `,
        slug: termSlug,
        ext: ".html",
      })
    }
  },
})

interface GlossaryTerm {
  term: string
  sectionAnchor: string
}

function extractTerms(markdown: string): GlossaryTerm[] {
  const terms: GlossaryTerm[] = []
  let currentSection = ""

  for (const line of markdown.split("\n")) {
    // Track current ## section heading
    const sectionMatch = line.match(/^##\s+(.+)/)
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim()
      continue
    }

    // Extract **Bold Term** from list items
    const termMatch = line.match(/^\s*-\s+\*\*([^*]+)\*\*/)
    if (termMatch) {
      terms.push({
        term: termMatch[1].trim(),
        sectionAnchor: currentSection,
      })
    }
  }

  return terms
}
