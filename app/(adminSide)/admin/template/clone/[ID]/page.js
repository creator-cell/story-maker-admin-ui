import EditTemplate from "../../../../components/admin/EditTemplate";

export default function Page({ params }) {
  const roleId = params.ID;
  return (
    <>
      <EditTemplate id={roleId} />
    </>
  );
}
