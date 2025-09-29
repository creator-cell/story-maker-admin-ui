import initTranslations from '@/app/i18n';
import EditUser from '../../../../../components/admin/EditUser';
import TranslationProvider from '@/app/components/TranslationProvider';

const i18nNamespaces = ["common"];
const Page = async ({ params }) => {
    const { locale } = await params;
    console.log("params", locale);
    const { t, resources } = await initTranslations(locale, i18nNamespaces);
    const userId = params.ID;
    return (
        <TranslationProvider
            locale={locale}
            namespaces={i18nNamespaces}
            resources={resources}>
            <EditUser userId={userId} />
        </TranslationProvider>
    )
}
export default Page