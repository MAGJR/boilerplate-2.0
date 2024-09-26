import { FeatureInfo } from '../../..'

export interface IQuotaProvider {
  /**
   * Retrieves the feature quota for a given tenant and feature.
   * @param tenantId The ID of the tenant.
   * @param feature The feature to check the quota for.
   * @returns A promise that resolves to an object containing the availability and quota of the feature.
   */
  getFeatureQuota(tenantId: string, feature: string): Promise<FeatureInfo>

  /**
   * Retrieves all features and their quotas for a given tenant.
   * @param tenantId The ID of the tenant.
   * @returns A promise that resolves to an array of FeatureInfo objects.
   */
  getTenantFeatures(tenantId: string): Promise<FeatureInfo[]>
}
