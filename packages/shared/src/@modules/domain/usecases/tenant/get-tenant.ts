import { interpolate, shared } from '@app/shared'
import { IQuotaProvider } from '../../../interfaces/providers/quota-provider'
import { IMembershipRepository } from '../../../interfaces/repositories/membership'
import { IPlanRepository } from '../../../interfaces/repositories/plan'
import { ISubscriptionRepository } from '../../../interfaces/repositories/subscription'
import { ITenantRepository } from '../../../interfaces/repositories/tenant'
import { IUserRepository } from '../../../interfaces/repositories/user'
import { Tenant } from '../../entities/Tenant'
import {
  PlanFeature,
  TenantSubscription,
} from '../../entities/TenantSubscription'

/**
 * Represents the use case for retrieving a tenant.
 * This class encapsulates the logic for fetching a tenant entity from the repository based on its ID and validating the user's membership.
 */
export class GetTenantUseCase {
  /**
   * Constructs a new instance of the GetTenantUseCase.
   *
   * @param {IUserRepository} userRepository - The repository for managing users.
   * @param {ITenantRepository} tenantRepository - The repository for managing tenants.
   * @param {IMembershipRepository} membershipRepository - The repository for managing memberships.
   * @param {ISubscriptionRepository} subscriptionRepository - The repository for managing subscriptions.
   * @param {IPlanRepository} planRepository - The repository for managing plans.
   * @param {IQuotaProvider} quotaProvider - The provider for quota management.
   */
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tenantRepository: ITenantRepository,
    private readonly membershipRepository: IMembershipRepository,
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly planRepository: IPlanRepository,
    private readonly quotaProvider: IQuotaProvider,
  ) {}

  /**
   * Executes the use case for retrieving a tenant.
   * This method first checks if the tenant and user exist, then verifies the user's membership on the tenant.
   * It also parses the tenant's settings using the JsonParserDateObject.
   * If all checks pass, it returns the tenant entity with its settings; otherwise, it throws an error.
   *
   * @param {string} tenantId - The unique identifier of the tenant to be retrieved.
   * @param {string} userId - The unique identifier of the user making the request.
   * @returns {Promise<Tenant & { subscription: TenantSubscription }>} A promise that resolves to the Tenant entity with subscription information.
   */
  async execute(
    tenantId: string,
    userId?: string,
  ): Promise<Tenant & { subscription: TenantSubscription }> {
    if (!tenantId) {
      throw new Error('Tenant ID is required')
    }

    const tenant = await this.tenantRepository.getById(tenantId)
    if (!tenant) {
      throw new Error('Tenant not found')
    }

    let user
    let membership

    if (userId) {
      user = await this.userRepository.getById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      membership = await this.membershipRepository.getByUserOnTenant(
        userId,
        tenantId,
      )
      if (!membership) {
        throw new Error('Membership not valid')
      }
    }

    const subscription = await this.subscriptionRepository.findFirst({
      tenantId,
    })
    if (!subscription) {
      throw new Error('No subscription found for tenant')
    }

    const plan = await this.planRepository.findByPriceId(subscription.priceId)
    if (!plan) {
      throw new Error('Plan not found for subscription')
    }

    const features = await this.quotaProvider.getTenantFeatures(tenantId)

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
    }
  }

  private mapPlanFeatures(metadata: Record<string, string>): PlanFeature[] {
    return Object.keys(metadata).map((key) => ({
      id: key,
      value: metadata[key],
      label: shared.config.application.providers.billing.meta?.[key]?.label
        ? interpolate(
            shared.config.application.providers.billing.meta[key].label,
            {
              value: metadata[key],
            },
          )
        : undefined,
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
