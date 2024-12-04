'use client';

import { CONFIG } from '@/config';
import { api } from '@/utils';
import { Box, Paper, Stack, Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Image from 'next/image';

dayjs.extend(relativeTime);

interface GetChamberPostsData {
  _id: string;
  title: string;
  content?: string;
  media: boolean;
  chamber: string;
  user: string;
  upvotes: number;
  downvotes: number;
  votes: number;
  createdAt: string;
}

const getChamberPosts = async (chamberName: string) => {
  const response = await api.get<GetChamberPostsData[]>(
    `/chambers/${chamberName}/posts`,
  );
  return response.data;
};

interface PostListProps {
  chamberName: string;
}

export function PostList({ chamberName }: PostListProps) {
  const { data: posts } = useQuery({
    queryKey: ['chambers', chamberName, 'posts'],
    queryFn: () => getChamberPosts(chamberName),
  });

  return (
    <Stack>
      {posts?.map(post => (
        <Paper key={post._id} withBorder p={'lg'}>
          <Stack gap={'xs'}>
            <Text c={'dimmed'} fz={'xs'}>
              {post.user} - {dayjs(post.createdAt).fromNow()}
            </Text>
            <Title order={4}>{post.title}</Title>
            {!post.media && <Text>{post.content}</Text>}
            {post.media && (
              <Box w={'100%'} h={500} pos={'relative'}>
                <Image
                  alt={post.title}
                  src={`${CONFIG.PUBLIC_CDN_URL}/chambers/${chamberName}/posts/${post._id}.webp`}
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </Box>
            )}
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
