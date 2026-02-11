import DataRenderer from '@/components/DataRenderer/DataRenderer';

interface SubmissionsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SubmissionsPage({ params }: SubmissionsPageProps) {
  const { id } = await params;
  return <DataRenderer formId={id} />;
}
