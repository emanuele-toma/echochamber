import { CONFIG } from '@/config';
import { AspectRatio, Box, Paper, Stack } from '@mantine/core';
import Image from 'next/image';
import { PostTitle } from '../PostTitle';

interface MediaPostProps {
  chamberName: string;
  postId: string;
  username: string;
  createdAt: string;
  title: string;
}

export function MediaPost({
  chamberName,
  postId,
  username,
  createdAt,
  title,
}: MediaPostProps) {
  return (
    <AspectRatio ratio={4 / 3}>
      <Paper withBorder p={'lg'} radius={'md'}>
        <Stack gap={'md'} h={'100%'}>
          <PostTitle username={username} createdAt={createdAt} title={title} />
          <Box h={'100%'}>
            <Image
              alt={title}
              src={`${CONFIG.PUBLIC_S3_URL}/chambers/${chamberName}/posts/${postId}.webp`}
              width={720}
              height={720}
              style={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
                borderRadius: 'var(--mantine-radius-md)',
              }}
            />
          </Box>
        </Stack>
      </Paper>
    </AspectRatio>
  );
}
