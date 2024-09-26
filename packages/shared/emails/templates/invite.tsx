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

export default function InviteEmail({
  email = 'user@acme.co',
  team = 'Acme Inc.',
  url = 'https://google.com',
}: {
  email: string
  team: string
  url: string
}) {
  return (
    <Html>
      <Head />
      <Preview>
        You're invited to join the team at {team} on{' '}
        {shared.config.application.name}.
      </Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded-md border border-solid border-gray-200 px-10 py-5">
            <Section className="mt-8">
              <Img
                src={shared.config.application.brand.logos.icon.light}
                width="40"
                height="40"
                alt="Team Logo"
                className="my-0"
              />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-left text-xl font-semibold text-black">
              Welcome to {team}!
            </Heading>
            <Text className="text-sm leading-6 text-black">Hello!</Text>
            <Text className="text-sm leading-6 text-black">
              You have been invited to join {team} on{' '}
              {shared.config.application.name}. We are excited to have you on
              board and look forward to collaborating with you.
            </Text>
            <Text className="text-sm leading-6 text-black">
              To get started, please click the link below to accept your
              invitation and set up your account:
            </Text>
            <Text className="text-sm leading-6 text-black">
              <a href={url} className="text-blue-500 hover:underline">
                Accept Invitation
              </a>
            </Text>
            <Text className="text-sm font-light leading-6 text-gray-400">
              If you have any questions or need assistance, feel free to reach
              out to us.
            </Text>
            <Footer email={email} marketing />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
