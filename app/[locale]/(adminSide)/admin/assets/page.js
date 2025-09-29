import AssetsManage from "@/app/components/admin/AssetsManage";
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
            <AssetsManage />
        </TranslationProvider>
    );
}

export default Page;