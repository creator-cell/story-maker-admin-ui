// import Users from "@/app/components/admin/Users";
import Users from "@/app/components/admin/Users";
import initTranslations from "@/app/i18n";
import TranslationProvider from "@/app/components/TranslationProvider";
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
      <Users />
    </TranslationProvider>
  );
};
export default Page;
