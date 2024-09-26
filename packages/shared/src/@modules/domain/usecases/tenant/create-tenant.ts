import { TenantMetadata } from '../../../../@data/schemas'
import { SlugValueObject } from '../../../infrastructure/slug/value-object-slug'
import { IPaymentProvider } from '../../../interfaces/providers/payment'
import { IMembershipRepository } from '../../../interfaces/repositories/membership'
import { IPlanPriceRepository } from '../../../interfaces/repositories/plan-price'
import { ISubscriptionRepository } from '../../../interfaces/repositories/subscription'
import { ITenantRepository } from '../../../interfaces/repositories/tenant'
import { IUserRepository } from '../../../interfaces/repositories/user'
import { ChildPartial } from '../../../types/child-partial'
import { Tenant } from '../../entities/Tenant'

export class CreateTenantUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tenantRepository: ITenantRepository,
    private readonly membershipRepository: IMembershipRepository,
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly paymentProvider: IPaymentProvider,
    private readonly planPriceRepository: IPlanPriceRepository,
  ) {}

  async execute(
    userId: string,
    data: {
      name: string
      settings: ChildPartial<TenantMetadata>
    },
  ): Promise<Tenant> {
    const userExists = await this.userRepository.getById(userId)
    if (!userExists) {
      throw new Error('User does not exist')
    }

    const slug = SlugValueObject.createFromText(data.name)
    const slugAlreadyExists = await this.tenantRepository.getBySlug(slug)

    if (slugAlreadyExists) {
      throw new Error('Slug already exists')
    }

    const billingEmail = data.settings.billing?.email || userExists.email

    const customer = await this.paymentProvider.upsertCustomer({
      name: data.name,
      email: billingEmail,
    })

    const planPrice = await this.planPriceRepository.getFreePlanPrice()

    if (!planPrice) {
      throw new Error('Plan Price is invalid')
    }

    const tenant = await this.tenantRepository.create({
      name: data.name,
      slug,
      paymentProviderId: customer.id,
      settings: {
        ...data.settings,
        billing: {
          ...data.settings.billing,
          email: billingEmail,
        },
      },
    })

    await this.membershipRepository.create({
      tenantId: tenant.id,
      userId,
      role: 'owner',
    })

    const subscription = await this.paymentProvider.createSubscription({
      customerId: customer.id,
      planId: planPrice.paymentProviderId,
    })

    await this.subscriptionRepository.create({
      tenantId: tenant.id,
      status: subscription.status,
      priceId: planPrice.id,
      paymentProviderId: subscription.paymentProviderId,
    })

    return tenant
  }
}
