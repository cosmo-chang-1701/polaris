import { cookies, headers } from 'next/headers'
import { createInstance, Namespace, FlatNamespace, KeyPrefix } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { FallbackNs } from 'react-i18next'
import { fallbackLng, getOptions, cookieName, languages } from './settings'
import acceptLanguage from 'accept-language'

acceptLanguage.languages(languages)

// Initialize i18next instance asynchronously
const initI18next = async (lng: string, ns: string | string[]) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        // Use i18next-resources-to-backend to load translation resources dynamically
        (language: string, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init(getOptions(lng, ns))
  return i18nInstance
}

export async function getTranslation<
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined
>(ns?: Ns, options: { keyPrefix?: KPrefix } = {}) {
  let lng
  // Check if locale cookie exists and retrieve language from it
  if (cookies().has(cookieName))
    lng = acceptLanguage.get(cookies().get(cookieName)?.value)

  // If language is not found from cookie, try to get it from Accept-Language header
  if (!lng) lng = acceptLanguage.get(headers().get('Accept-Language'))

  // If language is still not found, fallback to default fallbackLng
  if (!lng) lng = fallbackLng

  // Initialize i18next instance with detected or default language and namespaces
  const i18nextInstance = await initI18next(
    lng,
    Array.isArray(ns) ? (ns as string[]) : (ns as string)
  )
  return {
    t: i18nextInstance.getFixedT(lng, ns, options.keyPrefix),
    i18n: i18nextInstance
  }
}
