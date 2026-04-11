import { QuartzTransformerPlugin } from "../types"
import { slug as slugAnchor } from "github-slugger"
import { Root as HtmlRoot } from "hast"
import { visit } from "unist-util-visit"

const GLOSSARY_SLUG = "src/glossary"

/**
 * GlossaryAnchors: injects `id` attributes on glossary term list items at render time.
 *
 * Quartz only generates `id` attributes for headings. The glossary uses bold list items
 * (`- **Term**: ...`) and plain list items (`- Name (description)`) for people, neither
 * of which get anchors. This transformer adds them so that redirect pages (from
 * GlossaryRedirects) can scroll to the exact term.
 *
 * Runs on the glossary page only. Operates on the HAST (HTML AST) after markdown parsing.
 */
export const GlossaryAnchors: QuartzTransformerPlugin = () => ({
  name: "GlossaryAnchors",
  htmlPlugins() {
    return [
      () => {
        return (tree: HtmlRoot, file) => {
          // Only process the glossary page
          if (file.data.slug !== GLOSSARY_SLUG) return

          let currentSection = ""

          visit(tree, "element", (node) => {
            // Track section headings (h2) to identify the People section
            if (node.tagName === "h2") {
              const text = getTextContent(node)
              if (text) {
                currentSection = text
              }
              return
            }

            // Process list items
            if (node.tagName !== "li") return

            // Case 1: Bold terms — <li> containing a <strong> child
            const strongChild = node.children.find(
              (child) => child.type === "element" && child.tagName === "strong",
            )
            if (strongChild && strongChild.type === "element") {
              const term = getTextContent(strongChild)
              if (term && !/[`<>]/.test(term)) {
                node.properties = node.properties ?? {}
                node.properties.id = slugAnchor(term)
              }
              return
            }

            // Case 2: People names — plain <li> under the "People" section
            if (currentSection.startsWith("People")) {
              const text = getTextContent(node)
              if (text) {
                // Extract name before the first parenthetical
                const match = text.match(/^([^(]+?)(?:\s*\()/)
                const name = match ? match[1].trim() : text.trim()
                if (name && name.length < 50) {
                  node.properties = node.properties ?? {}
                  node.properties.id = slugAnchor(name)
                }
              }
            }
          })
        }
      },
    ]
  },
})

/** Recursively extract text content from a HAST node. */
function getTextContent(node: any): string {
  if (node.type === "text") return node.value ?? ""
  if (node.children) {
    return node.children.map(getTextContent).join("")
  }
  return ""
}
