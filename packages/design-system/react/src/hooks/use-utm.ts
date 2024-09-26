'use client';

import Cookies from 'js-cookie';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Interface for defining the UTM parameters.
 * @interface UTMParams
 * @property {string | null} [utm_source] - The UTM source parameter.
 * @property {string | null} [utm_medium] - The UTM medium parameter.
 * @property {string | null} [utm_campaign] - The UTM campaign parameter.
 * @property {string | null} [utm_term] - The UTM term parameter.
 * @property {string | null} [utm_content] - The UTM content parameter.
 */
export type UTMParams = {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
};

/**
 * Interface for the return value of the useUTM hook.
 * @interface UTMHookReturn
 * @property {UTMParams} values - The UTM parameters.
 * @property {string} queryValues - The query string of the UTM parameters.
 */
export type UTMHookReturn = {
  values: UTMParams
  queryValues: string
}

/**
 * Hook to manage UTM parameters.
 * 
 * This hook retrieves UTM parameters from the URL and cookies, and updates the cookies with the new UTM parameters.
 * It returns the UTM parameters and the query string of the UTM parameters.
 * 
 * @returns {UTMHookReturn} - The UTM parameters and the query string of the UTM parameters.
 */
export function useUTM():UTMHookReturn  {
  const searchParams = useSearchParams();

  /**
   * Function to get UTM parameters from the URL.
   * @param {URLSearchParams} searchParams - The search parameters from the URL.
   * @returns {UTMParams} - The UTM parameters.
   */
  function getUTMParams(searchParams: URLSearchParams): UTMParams {
    return {
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign'),
      utm_term: searchParams.get('utm_term'),
      utm_content: searchParams.get('utm_content'),
    };
  }
  
  /**
   * Function to get UTM parameters from cookies.
   * @returns {UTMParams} - The UTM parameters.
   */
  function getCookieParams(): UTMParams {
    return {
      utm_source: Cookies.get('utm_source'),
      utm_medium: Cookies.get('utm_medium'),
      utm_campaign: Cookies.get('utm_campaign'),
      utm_term: Cookies.get('utm_term'),
      utm_content: Cookies.get('utm_content'),
    };
  }
  
  /**
   * Function to update cookies with UTM parameters.
   * @param {UTMParams} utmParams - The new UTM parameters.
   * @param {UTMParams} cookieParams - The current UTM parameters from cookies.
   */
  function updateCookiesWithUTMParams(utmParams: UTMParams, cookieParams: UTMParams): void {
    Object.keys(utmParams).forEach(key => {
      const paramKey = key as keyof UTMParams;
      const newValue = utmParams[paramKey];
      const oldValue = cookieParams[paramKey];
  
      if (newValue && newValue !== oldValue) {
        Cookies.set(key, newValue, { expires: 30 }); // Set cookie to expire in 30 days
      }
    });
  }



  const utmParams = getUTMParams(searchParams);
  const cookieParams = getCookieParams();

  useEffect(() => {
    updateCookiesWithUTMParams(utmParams, cookieParams);
  }, [utmParams, cookieParams]);

  return {
    values: { ...cookieParams, ...utmParams },
    queryValues: new URLSearchParams(searchParams).toString()
  };
}
