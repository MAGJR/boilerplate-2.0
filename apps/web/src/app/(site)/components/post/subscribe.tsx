import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { shared } from '@app/shared'

export function Subscribe() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <div className="flex items-center space-x-2">
      <p className="text-sm text-muted-foreground">
        {dict.site.sections.blog.subscribeToUpdates} →
      </p>
      <a
        className="rounded-full bg-blue-400/10 p-2 transition-colors hover:bg-blue-400/20"
        target="_blank"
        rel="noopener noreferrer"
        href={shared.config.application.links.twitter}
      >
        <div className="group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 248 204"
            className="group-hover:hidden h-4 w-4 text-[#1d9bf0]"
          >
            <path
              fill="currentColor"
              d="M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-.87-23.56-4.76-40.51-25.46-40.51-49.5v-.64c7.02 3.91 14.88 6.08 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71c25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.2 26.16z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1668.56 1221.19"
            className="hidden scale-150 group-hover:block h-4 w-4 text-[#1d9bf0]"
          >
            <g transform="translate(52.390088,-25.058597)">
              <path
                fill="currentColor"
                d="M283.94,167.31l386.39,516.64L281.5,1104h87.51l340.42-367.76L984.48,1104h297.8L874.15,558.3l361.92-390.99   h-87.51l-313.51,338.7l-253.31-338.7H283.94z M412.63,231.77h136.81l604.13,807.76h-136.81L412.63,231.77z"
              />
            </g>
          </svg>
        </div>
      </a>
      <a
        className="rounded-full bg-gray-400/10 p-2 transition-colors hover:bg-gray-400/20"
        href="/feed.xml"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-green-400/60"
        >
          <path d="M4 11a9 9 0 0 1 9 9" />
          <path d="M4 4a16 16 0 0 1 16 16" />
          <circle cx={5} cy={19} r={1} />
        </svg>
      </a>
    </div>
  )
}
