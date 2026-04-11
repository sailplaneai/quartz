import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "Helm",
    pageTitleSuffix: " | Helm",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "en-US",
    baseUrl: "localhost",
    ignorePatterns: [
      ".obsidian",
      "private",
      "templates",
      "ingestion/raw",
      "dist",
      "*.dot",
    ],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "local",
      cdnCaching: false,
      typography: {
        header: "Geist Sans",
        body: "Geist Sans",
        code: "Geist Mono",
      },
      colors: {
        lightMode: {
          light: "#f5f6f7",
          lightgray: "#e2e8f0",
          gray: "#b6c2d2",
          darkgray: "#475569",
          dark: "#0f172a",
          secondary: "#282d37",
          tertiary: "#27375b",
          highlight: "#ffffff",
          textHighlight: "rgba(34, 115, 191, 0.2)",
        },
        darkMode: {
          light: "#1e1e1e",
          lightgray: "#3c3d3f",
          gray: "#7f828a",
          darkgray: "#cdd2da",
          dark: "#f8fafc",
          secondary: "#e5e8ef",
          tertiary: "#5ba3e0",
          highlight: "#2d2d30",
          textHighlight: "rgba(91, 163, 224, 0.2)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.StripFoamLinks(),
      Plugin.StripDuplicateTitle(),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.GlossaryAnchors(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.GlossaryRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: false,
        enableRSS: false,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
