import TransferPointClient from "@/components/common/transfer-point-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <TransferPointClient toParam={id} />;
}
