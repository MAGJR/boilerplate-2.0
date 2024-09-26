import React from 'react'
import { ApplicationContext } from '../_contexts/application.context'

/**
 * Custom hook to access the ApplicationContext.
 *
 * This hook provides access to the application state, including
 * the current session, available plans, and application configuration.
 *
 * @returns {ApplicationContextProps} The context value containing
 * the session, plans, and configuration.
 */
export const useApplication = () => {
  const context = React.useContext(ApplicationContext)
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider')
  }
  return context
}
