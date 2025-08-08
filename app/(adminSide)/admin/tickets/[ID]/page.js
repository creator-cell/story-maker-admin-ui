import UserChat from "../../../../components/admin/SupportTicketChat";

export default function Page({ params }) {
  const ticketId = params.ID;
  //const currentUser = localStorage.getItem("user");
  return (
    <>
      <UserChat ticketId={ticketId} />
    </>
  );
}
