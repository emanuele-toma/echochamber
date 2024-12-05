import { PostList } from '@/components/PostList';
import { internalApi } from '@/utils';
import { Container } from '@mantine/core';

interface ChamberResponse {
  _id: string;
  name: string;
  description: string;
  owner: string;
}

interface PageProps {
  params: Promise<{ chamberName: string }>;
}

export default async function Chamber({ params }: PageProps) {
  const { data: chamber } = await internalApi.get<ChamberResponse>(
    `/chambers/${(await params).chamberName}`,
  );

  return (
    <Container size={'sm'}>
      <h1>{chamber.name}</h1>
      <PostList chamberName={chamber.name} />
    </Container>
  );
}
