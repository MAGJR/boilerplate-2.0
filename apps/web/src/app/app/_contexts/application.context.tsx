'use client'

import { useAction } from '@/services/actions/implementations/client'
import { ReturnTypeWithoutPromise } from '@/services/actions/implementations/utils'
import { ApplicationSession } from '@/services/session'
import { FeatureInfo, shared } from '@app/shared'
import { useDisclosure } from '@design-system/react/hooks/use-disclosure'
import { createContext, PropsWithChildren, useState } from 'react'
import { UpgradePlanSheet } from '../(dashboard)/_components/upgrade-plan-sheet'
import {
  createCheckoutSessionAction,
  createManagerSessionAction,
  getFeatureQuotaAction,
  getPlansAction,
} from '../(settings)/settings/billing/actions'

/**
 * Represents the state and actions related to billing functionality.
 */
export interface BillingState {
  period: 'month' | 'year'
  setPeriod: (period: 'month' | 'year') => void
  createCheckoutForPlan: (priceId: string) => Promise<void>
  createAccountManagerForTenant: () => Promise<void>
  checkFeatureQuota: (feature: string) => Promise<FeatureInfo>
  isSubmittingManager: boolean
  isSubmittingCheckout: boolean
  upgradePlanSheet: ReturnType<typeof useDisclosure>
}

/**
 * Represents the props for the ApplicationContext.
 */
export interface ApplicationContextProps {
  session: ApplicationSession
  plans: ReturnTypeWithoutPromise<typeof getPlansAction>
  config: typeof shared.config.application
  billing?: BillingState
}

/**
 * Context for managing application-wide state and actions.
 */
export const ApplicationContext = createContext<
  ApplicationContextProps | undefined
>(undefined)

/**
 * Provider component for the ApplicationContext.
 *
 * @param props - The props for the ApplicationProvider component.
 * @param props.children - The child components to be wrapped by the provider.
 * @param props.session - The application session data.
 * @param props.plans - The available plans for the application.
 */
export const ApplicationProvider: React.FC<
  PropsWithChildren<{
    session: ApplicationSession
    plans: ReturnTypeWithoutPromise<typeof getPlansAction>
  }>
> = ({ children, session, plans }) => {
  const [period, setPeriod] = useState<'month' | 'year'>('month')
  const upgradePlanSheet = useDisclosure()

  const createCheckoutSession = useAction(createCheckoutSessionAction)
  const createAccountSession = useAction(createManagerSessionAction)
  const getFeatureQuota = useAction(getFeatureQuotaAction)

  /**
   * Creates a checkout session for a specific plan.
   *
   * @param priceId - The ID of the price for the selected plan.
   */
  const createCheckoutForPlan = async (priceId: string) => {
    const url = await createCheckoutSession.execute({ priceId })
    openUrl(url)
  }

  /**
   * Creates an account manager session for the tenant.
   */
  const createAccountManagerForTenant = async () => {
    const url = await createAccountSession.execute({})
    openUrl(url)
  }

  /**
   * Checks the quota for a specific feature.
   *
   * @param feature - The feature to check the quota for.
   * @returns The feature quota information.
   */
  const checkFeatureQuota = async (feature: string): Promise<FeatureInfo> => {
    return await getFeatureQuota.execute({ feature })
  }

  /**
   * Opens a URL in a new window.
   *
   * @param url - The URL to open.
   */
  const openUrl = (url: string) => {
    window.open(url)
  }

  /**
   * Gets the billing state if a tenant is present in the session.
   *
   * @returns The billing state or undefined if no tenant is present.
   */
  const getBillingState = (): BillingState | undefined => {
    if (!session.tenant) return undefined

    return {
      period,
      setPeriod,
      createCheckoutForPlan,
      createAccountManagerForTenant,
      checkFeatureQuota,
      isSubmittingManager: createAccountSession.isSubmitting,
      isSubmittingCheckout: createCheckoutSession.isSubmitting,
      upgradePlanSheet,
    }
  }

  /**
   * Gets the context value for the ApplicationContext.
   *
   * @returns The context value containing session, plans, config, and billing state.
   */
  const getContextValue = (): ApplicationContextProps => ({
    session,
    plans,
    config: shared.config.application,
    billing: getBillingState(),
  })

  return (
    <ApplicationContext.Provider value={getContextValue()}>
      {children}
      {session.tenant && <UpgradePlanSheet />}
    </ApplicationContext.Provider>
  )
}
