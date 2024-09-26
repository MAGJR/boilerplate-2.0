import { Session } from './implementation/provider'

/**
 * Initializes and exports the session provider instance.
 *
 * This module initializes a new instance of the Session class from './provider'
 * and exports it as 'sessionProvider'. It also exports all types from './types'.
 */
export const sessionProvider = new Session()

export * from './implementation/types'
