import { db } from '@app/db'
import { HandleCheckoutSessionCompletedUseCase } from '@app/shared/src/@modules/domain/usecases/checkout-session/handle-checkout-session-completed'
import { HandleInvoicePaymentSucceededUseCase } from '@app/shared/src/@modules/domain/usecases/checkout-session/handle-invoice-payment-succeeded'
import { HandlePriceUpsertUseCase } from '@app/shared/src/@modules/domain/usecases/plan-price/handle-price-upsert'
import { HandleProductUpsertUseCase } from '@app/shared/src/@modules/domain/usecases/plan/handle-product-upsert'
import { SyncPlansUseCase } from '@app/shared/src/@modules/domain/usecases/plan/sync-plans'
import { HandleSubscriptionUpsertUseCase } from '@app/shared/src/@modules/domain/usecases/subscriptions/handle-subscription-upsert'
import { APP_CONFIGS } from '../boilerplate.config'
import { plugins } from '../boilerplate.plugins'
import { AcceptInviteUseCase } from './domain/usecases/invite/accept-invite'
import { CreateInviteUseCase } from './domain/usecases/invite/create-invite'
import { DeclineInviteUseCase } from './domain/usecases/invite/decline-invite'
import { DeleteInvitesUseCase } from './domain/usecases/invite/delete-invite'
import { GetInviteByIdUseCase } from './domain/usecases/invite/get-by-id'
import { ListInvitesUseCase } from './domain/usecases/invite/list-invites'
import { CreateMembershipOnTenantUseCase } from './domain/usecases/membership/create-membership-on-tenant'
import { DeleteMembershipOnTenantUseCase } from './domain/usecases/membership/delete-membership-on-tenant'
import { GetMembershipOnTenantUseCase } from './domain/usecases/membership/get-membership-on-tenant'
import { ListMembershipsOnTenantUseCase } from './domain/usecases/membership/list-memberships-on-tenant'
import { UpdateMembershipOnTenantUseCase } from './domain/usecases/membership/update-membership-on-tenant'
import { CreatePlanPriceUseCase } from './domain/usecases/plan-price/create-plan-price'
import { GetPlanPriceByIdUseCase } from './domain/usecases/plan-price/get-plan-price-by-id'
import { UpdatePlanPriceUseCase } from './domain/usecases/plan-price/update-plan-price'
import { UpsertPlanPriceUseCase } from './domain/usecases/plan-price/upsert-plan-price'
import { GetPlanByIdUseCase } from './domain/usecases/plan/get-plan-by-id'
import { GetPlanByProviderIdUseCase } from './domain/usecases/plan/get-plan-by-provider-id'
import { GetPlansUseCase } from './domain/usecases/plan/get-plans'
import { UpsertPlanUseCase } from './domain/usecases/plan/upsert-plan'
import { CancelSubscriptionUseCase } from './domain/usecases/subscriptions/cancel-subscription'
import { CreateSubscriptionUseCase } from './domain/usecases/subscriptions/create-subscription'
import { GetFirstSubscriptionOfTenantUseCase } from './domain/usecases/subscriptions/get-first-subscription-of-tenant'
import { GetSubscriptionByProviderIdUseCase } from './domain/usecases/subscriptions/get-subscription-by-provider-id'
import { ReactiveSubscriptionUseCase } from './domain/usecases/subscriptions/reactive-subscription'
import { UpdateSubscriptionUseCase } from './domain/usecases/subscriptions/update-subscription'
import { CreateTenantUseCase } from './domain/usecases/tenant/create-tenant'
import { GetTenantUseCase } from './domain/usecases/tenant/get-tenant'
import { GetTenantByExternalApiTokenUseCase } from './domain/usecases/tenant/get-tenant-by-external-api-token'
import { RegenerateExternalApiToken } from './domain/usecases/tenant/regenerate-external-api-token'
import { UpdateTenantUseCase } from './domain/usecases/tenant/update-tenant'
import { GetUserByIdUseCase } from './domain/usecases/user/get-user'
import { UpdateUserUseCase } from './domain/usecases/user/update-user'
import { ResendProvider } from './infrastructure/mail/resend-mail'
import { StripePaymentProvider } from './infrastructure/payment/stripe-payment'
import { PluginManager } from './infrastructure/plugin-manager'
import { PrismaInviteRepository } from './infrastructure/prisma/repositories/invite'
import { PrismaMembershipRepository } from './infrastructure/prisma/repositories/membership'
import { PrismaPlanRepository } from './infrastructure/prisma/repositories/plan'
import { PrismaPlanPriceRepository } from './infrastructure/prisma/repositories/plan-price'
import { PrismaSubscriptionRepository } from './infrastructure/prisma/repositories/subscription'
import { PrismaTenantRepository } from './infrastructure/prisma/repositories/tenant'
import { PrismaUserRepository } from './infrastructure/prisma/repositories/user'
import { QuotaProvider } from './infrastructure/quota-provider'
import { S3StorageProvider } from './infrastructure/storage/s3-storage-provider'
import { log } from './interfaces/core/log'

// REPOSITORIES
const inviteRepository = new PrismaInviteRepository(db)
const tenantRepository = new PrismaTenantRepository(db)
const userRepository = new PrismaUserRepository(db)
const membershipRepository = new PrismaMembershipRepository(db)
const subscriptionRepository = new PrismaSubscriptionRepository(db)
const planRepository = new PrismaPlanRepository(db)
const planPriceRepository = new PrismaPlanPriceRepository(db)

// PROVIDER
const mailProvider = new ResendProvider()
const storageProvider = new S3StorageProvider()
const paymentProvider = new StripePaymentProvider()
const pluginManager = new PluginManager(plugins, tenantRepository)
const quotaProvider = new QuotaProvider(
  tenantRepository,
  subscriptionRepository,
  planRepository,
)

export const shared = {
  repositories: {
    invite: inviteRepository,
    tenant: tenantRepository,
    user: userRepository,
    membership: membershipRepository,
    subscription: subscriptionRepository,
    plan: planRepository,
    planPrice: planPriceRepository,
  },
  usecases: {
    invite: {
      declineInvite: new DeclineInviteUseCase(
        inviteRepository,
        userRepository,
        tenantRepository,
      ),
      createInvite: new CreateInviteUseCase(
        inviteRepository,
        tenantRepository,
        quotaProvider,
      ),
      deleteInvite: new DeleteInvitesUseCase(
        inviteRepository,
        tenantRepository,
        userRepository,
        membershipRepository,
      ),
      listInvites: new ListInvitesUseCase(
        inviteRepository,
        tenantRepository,
        userRepository,
        membershipRepository,
      ),
      acceptInvite: new AcceptInviteUseCase(
        inviteRepository,
        tenantRepository,
        userRepository,
        membershipRepository,
      ),
      getInviteById: new GetInviteByIdUseCase(inviteRepository),
    },
    membership: {
      getMembershipOnTenant: new GetMembershipOnTenantUseCase(
        membershipRepository,
        tenantRepository,
        userRepository,
      ),
      createMembershipOnTenant: new CreateMembershipOnTenantUseCase(
        membershipRepository,
        tenantRepository,
        userRepository,
      ),
      deleteMembershipOnTenant: new DeleteMembershipOnTenantUseCase(
        membershipRepository,
        tenantRepository,
        userRepository,
      ),
      updateMembershipOnTenant: new UpdateMembershipOnTenantUseCase(
        membershipRepository,
      ),
      listMembershipsOnTenant: new ListMembershipsOnTenantUseCase(
        membershipRepository,
        tenantRepository,
        userRepository,
      ),
    },
    tenant: {
      getTenant: new GetTenantUseCase(
        userRepository,
        tenantRepository,
        membershipRepository,
        subscriptionRepository,
        planRepository,
        quotaProvider,
      ),
      createTenant: new CreateTenantUseCase(
        userRepository,
        tenantRepository,
        membershipRepository,
        subscriptionRepository,
        paymentProvider,
        planPriceRepository,
      ),
      updateTenant: new UpdateTenantUseCase(
        userRepository,
        tenantRepository,
        membershipRepository,
      ),
      regenerateExternalApiToken: new RegenerateExternalApiToken(
        userRepository,
        tenantRepository,
        membershipRepository,
      ),
      getTenantByExternalApiToken: new GetTenantByExternalApiTokenUseCase(
        tenantRepository,
        subscriptionRepository,
        planRepository,
        quotaProvider,
      ),
    },
    subscription: {
      createSubscription: new CreateSubscriptionUseCase(
        subscriptionRepository,
        tenantRepository,
        planPriceRepository,
      ),
      cancelSubscription: new CancelSubscriptionUseCase(
        subscriptionRepository,
        tenantRepository,
        planPriceRepository,
      ),
      getFirstSubscriptionOfTenant: new GetFirstSubscriptionOfTenantUseCase(
        subscriptionRepository,
        tenantRepository,
      ),
      getSubscriptionByProviderId: new GetSubscriptionByProviderIdUseCase(
        subscriptionRepository,
      ),
      reactiveSubscription: new ReactiveSubscriptionUseCase(
        subscriptionRepository,
        tenantRepository,
        planPriceRepository,
        planRepository,
      ),
      updateSubscription: new UpdateSubscriptionUseCase(subscriptionRepository),
      handleSubscriptionUpsert: new HandleSubscriptionUpsertUseCase(
        subscriptionRepository,
      ),
    },
    plan: {
      getPlanById: new GetPlanByIdUseCase(planRepository),
      getPlanByProviderId: new GetPlanByProviderIdUseCase(planRepository),
      upsertPlan: new UpsertPlanUseCase(planRepository),
      getPlans: new GetPlansUseCase(planRepository),
      handlePlanUpsert: new HandleProductUpsertUseCase(planRepository),
      syncPlans: new SyncPlansUseCase(
        planRepository,
        planPriceRepository,
        paymentProvider,
      ),
    },
    planPrice: {
      getPlanPriceById: new GetPlanPriceByIdUseCase(planPriceRepository),
      createPlanPrice: new CreatePlanPriceUseCase(planPriceRepository),
      updatePlanPrice: new UpdatePlanPriceUseCase(planPriceRepository),
      upsertPlanPrice: new UpsertPlanPriceUseCase(planPriceRepository),
      handlePriceUpsert: new HandlePriceUpsertUseCase(
        planRepository,
        planPriceRepository,
      ),
    },
    user: {
      updateUser: new UpdateUserUseCase(userRepository),
      getUserById: new GetUserByIdUseCase(userRepository),
    },
    checkout: {
      handleCheckoutSessionCompleted: new HandleCheckoutSessionCompletedUseCase(
        subscriptionRepository,
      ),
      handleInvoicePaymentSucceeded: new HandleInvoicePaymentSucceededUseCase(
        subscriptionRepository,
      ),
    },
  },
  provider: {
    mail: mailProvider,
    storage: storageProvider,
    payment: paymentProvider,
    plugin: pluginManager,
    quota: quotaProvider,
    log,
  },
  config: {
    application: APP_CONFIGS,
  },
}
