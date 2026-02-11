import FormCreator from '@/components/FormCreator/FormCreator';

interface EditFormPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditFormPage({ params }: EditFormPageProps) {
  const { id } = await params;
  return <FormCreator formId={id} />;
}
