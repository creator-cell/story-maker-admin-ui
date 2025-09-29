import Notification from "@/app/components/admin/Notification";
import TranslationProvider from "@/app/components/TranslationProvider";
import initTranslations from "@/app/i18n";
const i18nNamespaces = ["common"];
const Page = async ({ params }) => {
  const { locale } = await params;
  console.log("params", locale);
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
    return (
          <TranslationProvider
              locale={locale}
              namespaces={i18nNamespaces}
              resources={resources}
            >
            <Notification/>
        </TranslationProvider>
    );
};

export default Page;