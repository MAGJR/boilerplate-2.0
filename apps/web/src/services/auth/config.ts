/**
 * Importing necessary modules for authentication configuration.
 */

import EmailProvider from 'next-auth/providers/email'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

/**
 * Importing application configurations and adapters for authentication.
 */
import { db } from '@app/db'
import { LoginLink, shared, WelcomeEmail } from '@app/shared'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { renderAsync } from '@react-email/components'
import { NextAuthOptions } from 'next-auth'

/**
 * Defining the authentication options for the application.
 */
export const authOptions: NextAuthOptions = {
  /**
   * Setting the adapter for the authentication process.
   */
  adapter: PrismaAdapter(db),
  /**
   * Configuring the pages for authentication.
   */
  pages: {
    signIn: '/auth',
    verifyRequest: '/auth',
    error: '/auth',
    newUser: '/app/get-started',
    signOut: '/auth',
  },
  /**
   * Defining the providers for authentication.
   */
  providers: [
    Google({
      clientId:
        shared.config.application.providers.auth.providers.google.clientId,
      clientSecret:
        shared.config.application.providers.auth.providers.google.clientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId:
        shared.config.application.providers.auth.providers.github.clientId,
      clientSecret:
        shared.config.application.providers.auth.providers.github.clientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      from: shared.config.application.providers.mail.from,
      sendVerificationRequest: async ({ identifier, url }) => {
        await shared.provider.mail.send({
          from: shared.config.application.providers.mail.from,
          to: identifier,
          subject: `Your ${shared.config.application.name} Login Link`,
          body: await renderAsync(
            LoginLink({
              email: identifier,
              url,
            }),
          ),
        })
      },
    }),
  ],
  /**
   * Defining callbacks for session management.
   */
  callbacks: {
    async session({ session, user }) {
      session.user = await shared.usecases.user.getUserById.execute(user.id)
      return session
    },
  },
  /**
   * Defining events for user creation.
   */
  events: {
    async createUser(message) {
      await shared.provider.mail.send({
        from: shared.config.application.providers.mail.from,
        to: message.user.email,
        subject: `Welcome to ${shared.config.application.name}`,
        body: await renderAsync(
          WelcomeEmail({
            email: message.user.email,
            name: message.user.name,
          }),
        ),
      })
    },
  },
}
