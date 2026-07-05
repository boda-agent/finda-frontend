import MasterProfileClient from "./MasterProfileClient";

export default async function MasterProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MasterProfileClient id={id} />;
}
