import EditTemplatePage from "./../../../../../components/admin/EditTemplate";

export default function Page({ params }) {
  const roleId = params.ID;
  return (
    <>
      <EditTemplatePage id={roleId} isClone="true" />
    </>
  );
}
