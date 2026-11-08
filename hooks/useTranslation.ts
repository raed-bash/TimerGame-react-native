import { translations } from "@/constants/i18n";
import usePreferences from "./usePreferences";

export default function useTranslation() {
  const { language } = usePreferences();
  return { t: translations[language], isRTL: language === "ar" };
}
