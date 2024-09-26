import { capitalize } from '@app/shared/src/@helpers/capitalize'
import { getUrl } from '@app/shared/src/@helpers/get-url'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { shared } from '../../src'
import Footer from './components/footer'

export default function UsageExceeded({
  email = 'panic@thedis.co',
  teamName = 'Acme Inc.',
  teamPlan = 'Pro',
}: {
  email: string
  teamName: string
  teamPlan: string
}) {
  return (
    <Html>
      <Head />
      <Preview>Usage Limit Exceeded</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded-md border border-solid border-gray-200 px-10 py-5">
            <Section className="mt-8">
              <Img
                src={shared.config.application.brand.logos.icon.light}
                width="40"
                height="40"
                alt={shared.config.application.name}
                className="my-0"
              />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-left text-xl font-semibold text-black">
              Usage Limit Exceeded
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Your {shared.config.application.name} team,{' '}
              <strong> {teamName} </strong> has exceeded the{' '}
              <strong> {capitalize(teamPlan)} Plan </strong>
              limit in your current billing cycle.
            </Text>
            <Text className="text-sm leading-6 text-black">
              Now, you will have some features disabled until your next cycle.
              However, you can upgrade your plan to get back to work normally.
            </Text>
            <Section className="my-8">
              <Link
                className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={getUrl('/app')}
              >
                Upgrade my plan
              </Link>
            </Section>
            <Text className="text-sm leading-6 text-black">
              Feel free to ignore this email if you don't plan on upgrading, or
              reply to let us know if you have any questions!
            </Text>
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
