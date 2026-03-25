import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "Helm",
    pageTitleSuffix: " — Sailplane Knowledge",
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
          light: "oklch(1 0 0)",
          lightgray: "oklch(0.922 0 0)",
          gray: "oklch(0.708 0 0)",
          darkgray: "oklch(0.556 0 0)",
          dark: "oklch(0.145 0 0)",
          secondary: "oklch(0.205 0 0)",
          tertiary: "oklch(0.556 0 0)",
          highlight: "oklch(0.97 0 0)",
          textHighlight: "oklch(0.85 0.15 85 / 0.4)",
        },
        darkMode: {
          light: "oklch(0.145 0 0)",
          lightgray: "oklch(0.269 0 0)",
          gray: "oklch(0.439 0 0)",
          darkgray: "oklch(0.708 0 0)",
          dark: "oklch(0.985 0 0)",
          secondary: "oklch(0.985 0 0)",
          tertiary: "oklch(0.708 0 0)",
          highlight: "oklch(0.269 0 0)",
          textHighlight: "oklch(0.75 0.15 85 / 0.4)",
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
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
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
