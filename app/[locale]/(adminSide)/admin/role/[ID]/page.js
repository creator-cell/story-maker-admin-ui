import initTranslations from '@/app/i18n';
import EditUser from '@/app/components/admin/EditRole';
import TranslationProvider from '@/app/components/TranslationProvider';
const i18nNamespaces = ["common"];
const Page = async ({ params }) => {
    const { locale } = await params;
    console.log("params", locale);
    const { t, resources } = await initTranslations(locale, i18nNamespaces);
    const roleId = params.ID;
    return (
        <TranslationProvider
            locale={locale}
            namespaces={i18nNamespaces}
            resources={resources}>
            <EditUser roleId={roleId} />
        </TranslationProvider>
    )
}
export default Page