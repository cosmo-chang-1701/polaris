export const fallbackLng = "en";
export const languages = [fallbackLng, "zh-TW"];
export const defaultNS = "translation";
export const cookieName = "locale";

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
  };
}
