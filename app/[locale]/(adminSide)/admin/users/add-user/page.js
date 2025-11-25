import initTranslations from '@/app/i18n';
import EditUser from '@/app/components/admin/users/AddUser';
import TranslationProvider from '@/app/components/TranslationProvider';
const i18nNamespaces = ["common"];
const Page = async ({ params }) => {
    const { locale } = await params;
    console.log("params", locale);
    const { t, resources } = await initTranslations(locale, i18nNamespaces);
    return (
        <TranslationProvider
            locale={locale}
            namespaces={i18nNamespaces}
            resources={resources}>
            <EditUser />
        </TranslationProvider>

    )
}

export default Page;
