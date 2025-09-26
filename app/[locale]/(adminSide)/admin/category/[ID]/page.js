import EditUser from "../../../../../components/admin/EditCategory";

export default function Page({ params }) {
  const roleId = params.ID;
  return (
    <>
      <EditUser userId={roleId} />
    </>
  );
}
