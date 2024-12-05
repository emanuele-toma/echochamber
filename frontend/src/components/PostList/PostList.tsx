'use client';

import { api } from '@/utils';
import { Stack } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Fragment } from 'react';
import { MediaPost } from '../MediaPost';
import { TextPost } from '../TextPost';

type GetChamberPostsData = {
  _id: string;
  title: string;
  chamber: string;
  user: {
    username: string;
    _id: string;
  };
  upvotes: number;
  downvotes: number;
  votes: number;
  createdAt: string;
} & (
  | {
      media: true;
    }
  | {
      media: false;
      content: string;
    }
);

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
        <Fragment key={post._id}>
          {post.media ? (
            <MediaPost
              chamberName={chamberName}
              postId={post._id}
              username={post.user.username}
              createdAt={post.createdAt}
              title={post.title}
            />
          ) : (
            <TextPost
              username={post.user.username}
              createdAt={post.createdAt}
              title={post.title}
              content={post.content!}
            />
          )}
        </Fragment>
      ))}
    </Stack>
  );
}
