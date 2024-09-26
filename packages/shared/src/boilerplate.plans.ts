import { FreePlan } from './@data/plans/free'
import { IndiePlan } from './@data/plans/indie'
import { StartupPlan } from './@data/plans/startup'
import { Plan } from './@modules/types/boilerplate.plan'

/**
 * Array of default plans available in the application.
 * This includes the Free, Indie, and Startup plans.
 *
 * @type {Plan[]}
 */
export const plans: Plan[] = [
  new FreePlan(),
  new IndiePlan(),
  new StartupPlan(),
]
