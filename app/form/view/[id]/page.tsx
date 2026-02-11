import FormRenderer from '@/components/FormRenderer/FormRenderer';

interface ViewFormPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ViewFormPage({ params }: ViewFormPageProps) {
  const { id } = await params;
  return <FormRenderer formId={id} />;
}
