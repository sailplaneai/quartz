import { StaticResources } from "../util/resources"
import { FilePath, FullSlug } from "../util/path"
import { BuildCtx } from "../util/ctx"

export function getStaticResourcesFromPlugins(ctx: BuildCtx) {
  const staticResources: StaticResources = {
    css: [],
    js: [],
    additionalHead: [],
  }

  for (const transformer of [...ctx.cfg.plugins.transformers, ...ctx.cfg.plugins.emitters]) {
    const res = transformer.externalResources ? transformer.externalResources(ctx) : {}
    if (res?.js) {
      staticResources.js.push(...res.js)
    }
    if (res?.css) {
      staticResources.css.push(...res.css)
    }
    if (res?.additionalHead) {
      staticResources.additionalHead.push(...res.additionalHead)
    }
  }

  // if serving locally, listen for rebuilds and reload the page
  if (ctx.argv.serve) {
    const wsUrl = ctx.argv.remoteDevHost
      ? `wss://${ctx.argv.remoteDevHost}:${ctx.argv.wsPort}`
      : `ws://localhost:${ctx.argv.wsPort}`

    staticResources.js.push({
      loadTime: "afterDOMReady",
      contentType: "inline",
      script: `
        const socket = new WebSocket('${wsUrl}')
        // reload(true) ensures resources like images and scripts are fetched again in firefox
        socket.addEventListener('message', () => document.location.reload(true))
      `,
    })
  } else {
    // For static deployments: poll /.build manifest for content updates.
    // On page load, capture the current build ID. On tab focus, check if
    // it changed. If so, reload. 404 (no manifest) silently no-ops.
    staticResources.js.push({
      loadTime: "afterDOMReady",
      contentType: "inline",
      script: `
        (function() {
          var buildId;
          function check() {
            fetch('/.build', { cache: 'no-store' })
              .then(function(r) { return r.ok ? r.text() : null; })
              .then(function(id) {
                if (!id) return;
                id = id.trim();
                if (!buildId) buildId = id;
                else if (id !== buildId) document.location.reload(true);
              })
              .catch(function() {});
          }
          check();
          document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') check();
          });
        })();
      `,
    })
  }

  return staticResources
}

export * from "./transformers"
export * from "./filters"
export * from "./emitters"

declare module "vfile" {
  // inserted in processors.ts
  interface DataMap {
    slug: FullSlug
    filePath: FilePath
    relativePath: FilePath
  }
}
