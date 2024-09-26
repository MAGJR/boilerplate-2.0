/**
 * Handles authentication requests using NextAuth.
 *
 * This function initializes NextAuth with the provided authentication options
 * and exports the handler for both GET and POST requests.
 *
 * @module Auth
 * @returns {NextAuth} The NextAuth handler configured with the specified options.
 */
import { authOptions } from '@/services/auth/config'
import NextAuth from 'next-auth/next'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
