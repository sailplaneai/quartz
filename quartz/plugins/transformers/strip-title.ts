import { QuartzTransformerPlugin } from "../types"
import { Root, Heading, Text } from "mdast"
import { visit, SKIP } from "unist-util-visit"

export const StripDuplicateTitle: QuartzTransformerPlugin = () => {
  return {
    name: "StripDuplicateTitle",
    markdownPlugins() {
      return [
        () => {
          return (tree: Root, file) => {
            const title = file.data.frontmatter?.title
            if (!title) return

            visit(tree, "heading", (node: Heading, index, parent) => {
              if (node.depth !== 1 || index === undefined || !parent) return SKIP

              // Extract text content from heading children
              const text = node.children
                .filter((c): c is Text => c.type === "text")
                .map((c) => c.value)
                .join("")
                .trim()

              if (text === title) {
                parent.children.splice(index, 1)
                return [SKIP, index]
              }

              // Only check the first h1
              return SKIP
            })
          }
        },
      ]
    },
  }
}
