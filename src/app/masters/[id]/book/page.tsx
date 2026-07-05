import BookingClient from "./BookingClient";

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BookingClient masterId={id} />;
}
