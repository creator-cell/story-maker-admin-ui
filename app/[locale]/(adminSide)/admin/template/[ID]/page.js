//import EditTemplate from "../../../../components/admin/EditTemplate";

// export default function Page({ params }) {
//   const roleId = params.ID;
//   return (
//     <>
//       <EditTemplate id={roleId} />
//     </>
//   );
// }
import MainEditor from "@/app/components/admin/editor";
export default function Page() {
  return (
    <>
      <MainEditor />
    </>
  );
}
