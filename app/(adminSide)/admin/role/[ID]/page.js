import EditUser from '../../../../components/admin/EditRole';

export default function Page({ params }) {
    const roleId = params.ID;
    return(
        <>
            <EditUser roleId={roleId} />
        </>
    )
}