import { cookies } from 'next/headers'

/**
 * Represents the UTM parameters that can be extracted from the request.
 *
 * @property {string | null} utm_source - The source of the traffic.
 * @property {string | null} utm_medium - The marketing medium.
 * @property {string | null} utm_campaign - The name of the campaign.
 * @property {string | null} utm_term - The keyword term.
 * @property {string | null} utm_content - The content of the ad.
 */
export type UTMParams = {
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_term?: string | null
  utm_content?: string | null
}

/**
 * Extracts UTM parameters from the request cookies.
 *
 * This function retrieves the UTM parameters from the request cookies and returns them as an object.
 *
 * @returns {UTMParams} An object containing the UTM parameters.
 */
export function getUTMSFromSSR(): UTMParams {
  return {
    utm_campaign: cookies().get('utm_campaign')?.value,
    utm_source: cookies().get('utm_source')?.value,
    utm_medium: cookies().get('utm_medium')?.value,
    utm_term: cookies().get('utm_term')?.value,
    utm_content: cookies().get('utm_content')?.value,
  }
}
