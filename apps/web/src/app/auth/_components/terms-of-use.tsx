import { shared } from '@app/shared'

export function TermsOfUse() {
  return (
    <span className="text-sm opacity-60 max-w-[80%] mt-4">
      By signing up, you agree to our <br />
      terms{' '}
      <a
        href={shared.config.application.links.terms}
        target="_blank"
        className="underline"
      >
        <b>Terms of Use</b>
      </a>
    </span>
  )
}
