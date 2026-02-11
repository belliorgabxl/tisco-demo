import MyCouponDetailClient from "./ui";

export default async function MyCouponDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MyCouponDetailClient id={id} />;
}
