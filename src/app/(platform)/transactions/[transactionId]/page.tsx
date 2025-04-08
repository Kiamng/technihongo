import { TransactionDetailPage } from "@/components/module/Transactions/transactionDetail";

interface TransactionDetailPageParams {
  params: Promise<{ transactionId: string }>;
}

export default async function TransactionDetail({
  params,
}: TransactionDetailPageParams) {
  const { transactionId } = await params; // Await the params to access transactionId

  return <TransactionDetailPage transactionId={parseInt(transactionId)} />;
}
