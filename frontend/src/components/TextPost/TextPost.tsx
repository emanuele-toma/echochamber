import { Paper, Stack } from '@mantine/core';
import { Markdown } from '../Markdown';
import { PostTitle } from '../PostTitle';

interface TextPostProps {
  username: string;
  createdAt: string;
  title: string;
  content: string;
}

export function TextPost({
  username,
  createdAt,
  title,
  content,
}: TextPostProps) {
  return (
    <Paper
      withBorder
      p={'lg'}
      mah={500}
      radius={'md'}
      style={{ overflow: 'hidden' }}
    >
      <Stack gap={'md'} h={'100%'}>
        <PostTitle username={username} createdAt={createdAt} title={title} />
        <Markdown
          content={content}
          style={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 10,
          }}
        />
      </Stack>
    </Paper>
  );
}
