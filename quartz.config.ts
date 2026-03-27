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
          light: "#ffffff",
          lightgray: "#e5e5e5",
          gray: "#a1a1a1",
          darkgray: "#737373",
          dark: "#0a0a0a",
          secondary: "#171717",
          tertiary: "#737373",
          highlight: "#f5f5f5",
          textHighlight: "rgba(194, 171, 100, 0.4)",
        },
        darkMode: {
          light: "#0a0a0a",
          lightgray: "#262626",
          gray: "#525252",
          darkgray: "#a1a1a1",
          dark: "#fafafa",
          secondary: "#fafafa",
          tertiary: "#a1a1a1",
          highlight: "#262626",
          textHighlight: "rgba(172, 148, 80, 0.4)",
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
