import { db } from '@app/db'
import { FeatureInfo, shared } from '@app/shared'
import { endOfMonth, startOfMonth } from 'date-fns'
import { error, log } from '../../interfaces/core/log'
import { IQuotaProvider } from '../../interfaces/providers/quota-provider'
import { IPlanRepository } from '../../interfaces/repositories/plan'
import { ISubscriptionRepository } from '../../interfaces/repositories/subscription'
import { ITenantRepository } from '../../interfaces/repositories/tenant'

export class QuotaProvider implements IQuotaProvider {
  constructor(
    private tenantRepository: ITenantRepository,
    private subscriptionRepository: ISubscriptionRepository,
    private planRepository: IPlanRepository,
  ) {}

  /**
   * Retrieves the feature quota for a specific tenant.
   * @param tenantId - The ID of the tenant.
   * @param feature - The feature identifier.
   * @returns A Promise that resolves to the feature information.
   */
  async getFeatureQuota(
    tenantId: string,
    feature: string,
  ): Promise<FeatureInfo> {
    log({
      provider: 'QuotaProvider',
      message: 'Getting feature quota',
      data: { tenantId, feature },
      context: 'getFeatureQuota',
    })
    const features = await this.getTenantFeatures(tenantId)
    const featureInfo = features.find((f) => f.id === feature)

    if (!featureInfo) {
      error({
        provider: 'QuotaProvider',
        message: `Feature ${feature} not found for tenant ${tenantId}`,
        context: 'getFeatureQuota',
      })
      throw new Error(`Feature ${feature} not found for tenant ${tenantId}`)
    }

    log({
      provider: 'QuotaProvider',
      message: 'Feature quota retrieved',
      data: featureInfo,
      context: 'getFeatureQuota',
    })
    return {
      id: feature,
      available: featureInfo.available,
      quota: {
        total: featureInfo.quota?.total ?? 0,
        usage: featureInfo.quota?.usage ?? 0,
        available: featureInfo.quota?.available ?? 0,
        usageRate: featureInfo.quota?.usageRate ?? 0,
      },
    }
  }

  /**
   * Retrieves the features associated with a specific tenant.
   * @param tenantId - The ID of the tenant.
   * @returns A Promise that resolves to an array of feature information.
   */
  async getTenantFeatures(tenantId: string): Promise<FeatureInfo[]> {
    log({
      provider: 'QuotaProvider',
      message: 'Getting tenant features',
      data: { tenantId },
      context: 'getTenantFeatures',
    })
    const tenant = await this.tenantRepository.getById(tenantId)
    if (!tenant) {
      error({
        provider: 'QuotaProvider',
        message: 'Tenant not found',
        data: { tenantId },
        context: 'getTenantFeatures',
      })
      throw new Error(`Tenant ${tenantId} not found`)
    }

    const subscription = await this.subscriptionRepository.findFirst({
      tenantId,
    })
    if (!subscription) {
      error({
        provider: 'QuotaProvider',
        message: 'Subscription not found',
        data: { tenantId },
        context: 'getTenantFeatures',
      })
      throw new Error(`No subscription found for tenant ${tenantId}`)
    }

    const plan = await this.planRepository.findByPriceId(subscription.priceId)
    if (!plan) {
      error({
        provider: 'QuotaProvider',
        message: 'Plan not found',
        data: { subscriptionId: subscription.id },
        context: 'getTenantFeatures',
      })
      throw new Error(`Plan not found for subscription ${subscription.id}`)
    }

    const features: FeatureInfo[] = []

    for (const [featureId, featureValue] of Object.entries(
      plan.metadata ?? {},
    )) {
      const featureConfig =
        shared.config.application.providers.billing.meta[featureId]

      if (!featureConfig) continue
      if (!featureConfig.table) continue

      const currentDate = new Date()
      const firstDayOfMonth = startOfMonth(currentDate)
      const lastDayOfMonth = endOfMonth(currentDate)

      const query: Record<string, any> = { tenantId }

      if (featureId !== 'TEAM_MEMBERS') {
        query.createdAt = {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        }
      }
      const count = await (db[featureConfig.table as any] as any).count({
        where: query,
      })

      const total = Number(featureValue)

      features.push({
        id: featureId,
        available: count < total,
        quota: {
          total,
          usage: count,
          available: total - count,
          usageRate: (count / total) * 100,
        },
      })
    }

    log({
      provider: 'QuotaProvider',
      message: 'Tenant features retrieved',
      data: { featuresCount: features.length },
      context: 'getTenantFeatures',
    })
    return features
  }
}
