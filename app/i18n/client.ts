'use client'

import { useEffect, useState } from 'react'
import i18next, { FlatNamespace, KeyPrefix } from 'i18next'
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
  UseTranslationOptions,
  UseTranslationResponse,
  FallbackNs
} from 'react-i18next'
import { useCookies } from 'react-cookie'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getOptions, languages, cookieName } from './settings'

// Import your language translation files
import zhTwTranslation from 'zod-i18n-map/locales/zh-TW/zod.json'

const runsOnServerSide = typeof window === 'undefined'

// Initialize i18next instance
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend((language: string, namespace: string) => {
      // Configure resource loading from local JSON files
      return import(`./locales/${language}/${namespace}.json`)
    })
  )

  .init({
    ...getOptions(),
    lng: undefined, // Let i18next detect language on the client side
    detection: {
      order: ['htmlTag', 'cookie', 'navigator'] // Order of language detection methods
    },
    preload: runsOnServerSide ? languages : [],
    partialBundledLanguages: true,
    resources: {
      'zh-TW': { zod: zhTwTranslation }
    }
  })
// Add additional zod i18n files after i18next initialization
i18next.addResourceBundle('zh-TW', 'zod', zhTwTranslation)

export function useTranslation<
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined
>(
  ns?: Ns,
  options?: UseTranslationOptions<KPrefix>
): UseTranslationResponse<FallbackNs<Ns>, KPrefix> {
  const [cookies, setCookie] = useCookies([cookieName])
  const ret = useTranslationOrg(ns, options)
  const { i18n } = ret
  const lng = i18n.resolvedLanguage

  // Change language on the server side if it's different from resolved language
  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng)
  } else {
    // Client-side handling of language changes
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage)

    // Update active language state when resolved language changes
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (activeLng === i18n.resolvedLanguage) return
      setActiveLng(i18n.resolvedLanguage)
    }, [activeLng, i18n.resolvedLanguage])

    // Change language in i18n instance when lng changes
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!lng || i18n.resolvedLanguage === lng) return
      i18n.changeLanguage(lng)
    }, [lng, i18n])

    // Set cookie when language changes
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (cookies.locale === lng) return
      setCookie(cookieName, lng, { path: '/' })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lng, cookies.locale])
  }
  return ret
}
