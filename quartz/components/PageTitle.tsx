import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={baseDir}>
        <svg
          class="page-title-icon"
          viewBox="0 0 80 73"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g>
            <rect width="80" height="13" />
            <rect x="16" y="15" width="64" height="13" />
            <rect x="32" y="30" width="48" height="13" />
            <rect x="48" y="45" width="32" height="13" />
            <rect x="64" y="60" width="16" height="13" />
          </g>
        </svg>
        {title}
      </a>
    </h2>
  )
}

PageTitle.css = `
.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
}

.page-title a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-title-icon {
  height: 1em;
  width: auto;
  fill: currentColor;
  flex-shrink: 0;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
