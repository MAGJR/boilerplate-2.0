import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { shared } from '../../src'
import Footer from './components/footer'

export default function UpgradeEmail({
  name = 'Brendon Urie',
  email = 'panic@thedis.co',
  plan = 'Pro',
  team = 'Acme Inc.',
}: {
  name: string | null
  email: string
  plan: string
  team: string
}) {
  return (
    <Html>
      <Head />
      <Preview>
        Thank you for upgrading to {shared.config.application.name} {plan}!
      </Preview>
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
              Thank you for upgrading your {team} team to{' '}
              {shared.config.application.name} {plan}!
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Hey{name && ` ${name}`}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              My name is {shared.config.application.creator.name}, and I'm the
              founder of {shared.config.application.name}. I wanted to
              personally reach out to thank you for upgrading to{' '}
              {shared.config.application.name} {plan}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              As you might already know, we are a 100% bootstrapped. Your
              support means the world to us and helps us continue to build and
              improve {shared.config.application.name}.
            </Text>

            <Text className="text-sm leading-6 text-black">
              Let me know if you have any questions or feedback. I'm always
              happy to help!
            </Text>

            <Text className="text-sm font-light leading-6 text-gray-400">
              {shared.config.application.creator.name} from{' '}
              {shared.config.application.name}
            </Text>

            <Footer email={email} marketing />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
