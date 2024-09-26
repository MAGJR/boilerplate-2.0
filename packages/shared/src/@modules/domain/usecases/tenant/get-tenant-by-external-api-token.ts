import { IQuotaProvider } from '../../../interfaces/providers/quota-provider'
import { IPlanRepository } from '../../../interfaces/repositories/plan'
import { ISubscriptionRepository } from '../../../interfaces/repositories/subscription'
import { ITenantRepository } from '../../../interfaces/repositories/tenant'
import { Tenant } from '../../entities/Tenant'
import {
  PlanFeature,
  TenantSubscription,
} from '../../entities/TenantSubscription'

/**
 * Represents the use case for retrieving a tenant by its external API token.
 * This class encapsulates the logic for fetching a tenant entity from the repository based on its external API token.
 */
export class GetTenantByExternalApiTokenUseCase {
  /**
   * Constructs a new instance of the GetTenantByExternalApiTokenUseCase.
   *
   * @param {ITenantRepository} tenantRepository - The repository for managing tenants.
   * @param {ISubscriptionRepository} subscriptionRepository - The repository for managing subscriptions.
   * @param {IPlanRepository} planRepository - The repository for managing plans.
   * @param {IQuotaProvider} quotaProvider - The provider for quota management.
   */
  constructor(
    private readonly tenantRepository: ITenantRepository,
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly planRepository: IPlanRepository,
    private readonly quotaProvider: IQuotaProvider,
  ) {}

  /**
   * Executes the use case for retrieving a tenant by its external API token.
   * This method first checks if the token is provided.
   * If the token is provided, it fetches the tenant from the repository using the token.
   * If the tenant is found, it fetches the subscription and plan information.
   * Finally, it returns the tenant entity with its settings parsed and subscription information.
   *
   * @param {string} token - The external API token of the tenant to be fetched.
   * @returns {Promise<Tenant & { subscription: TenantSubscription } | null>} A promise that resolves to the fetched Tenant entity with subscription information or null if not found.
   */
  async execute(token: string) {
    if (!token) {
      throw new Error('Token is required')
    }

    const tenant = await this.tenantRepository.getByExternalApiToken(token)
    if (!tenant) {
      return null
    }

    const subscription = await this.subscriptionRepository.findFirst({
      tenantId: tenant.id,
    })
    if (!subscription) {
      throw new Error('No subscription found for tenant')
    }

    const plan = await this.planRepository.findByPriceId(subscription.priceId)
    if (!plan) {
      throw new Error('Plan not found for subscription')
    }

    const features = await this.quotaProvider.getTenantFeatures(tenant.id)

    const planFeatures = this.mapPlanFeatures(plan.metadata ?? {})
    const currentPlan = this.createCurrentPlan(plan, subscription, planFeatures)

    const subscriptionInfo = this.createSubscriptionInfo(
      currentPlan,
      features,
      subscription,
    )

    return {
      ...tenant,
      subscription: subscriptionInfo,
    } as Tenant & { subscription: TenantSubscription }
  }

  private mapPlanFeatures(metadata: Record<string, string>): PlanFeature[] {
    return Object.keys(metadata).map((key) => ({
      id: key,
      value: metadata[key],
      label: undefined,
    }))
  }

  private createCurrentPlan(
    plan: any,
    subscription: any,
    planFeatures: PlanFeature[],
  ): any {
    return {
      id: plan.id,
      subscriptionPaymentProviderId: subscription.paymentProviderId,
      planPaymentProviderId: plan.paymentProviderId,
      pricePaymentProviderId: subscription.priceId,
      name: plan.name,
      metadata: plan.metadata,
      features: planFeatures,
      status: subscription.status,
      startDate: subscription.createdAt,
      endDate: subscription.endedAt,
      price: subscription.price?.price ?? 0,
      paymentInterval: subscription.price?.interval ?? 'month',
    }
  }

  private createSubscriptionInfo(
    currentPlan: any,
    features: any,
    subscription: any,
  ): TenantSubscription {
    return {
      currentPlan,
      features,
      trialInfo: {
        isInTrial: !!subscription.trialStart && !!subscription.trialEnd,
        trialStartDate: subscription.trialStart,
        trialEndDate: subscription.trialEnd,
      },
      billingDetails: {
        nextPaymentDue: subscription.currentPeriodEnd,
        lastPaymentDate: subscription.currentPeriodStart,
      },
    }
  }
}
