import AnalyticDashboard from "@/app/components/admin/AnalyticDashboard";
import TranslationProvider from "@/app/components/TranslationProvider";
import initTranslations from "@/app/i18n";
const i18nNamespaces = ["common"];
const Page = async ({ params }) => {
  const { locale } = await params;
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  return (
    <TranslationProvider
      locale={locale}
      namespaces={i18nNamespaces}
      resources={resources}
    >
      <AnalyticDashboard></AnalyticDashboard>
    </TranslationProvider>
  );
};
export default Page;
