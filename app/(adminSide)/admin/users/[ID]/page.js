import EditUser from '../../../../components/admin/EditUser';

export default function Page({ params }) {
    const userId = params.ID;
    return(
        <>
            <EditUser userId={userId} />
        </>
    )
}