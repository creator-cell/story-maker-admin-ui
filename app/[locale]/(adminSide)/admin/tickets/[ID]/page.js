import UserChat from "../../../../../components/admin/SupportTicketChat";

export default function Page({ params }) {
  const ticketId = params.ID;

  return (
    <>
      <UserChat ticketId={ticketId} />
    </>
  );
}
