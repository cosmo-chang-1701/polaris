export const fallbackLng = 'en'
export const languages = [fallbackLng, 'zh-TW']
export const defaultNS = 'translation'
export const cookieName = 'locale'

/**
 * Function to generate options for i18next configuration.
 * @param lng The selected language (default: fallbackLng)
 * @param ns The namespace(s) for translations (default: defaultNS)
 * @returns Options object with i18next configuration options
 */
export function getOptions(
  lng = fallbackLng,
  ns: string | string[] = defaultNS
) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  }
}
