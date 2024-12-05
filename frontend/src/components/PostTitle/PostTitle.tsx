import { Stack, Text, Title, Tooltip } from '@mantine/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface PostTitleProps {
  username: string;
  createdAt: string;
  title: string;
}

export function PostTitle({ username, createdAt, title }: PostTitleProps) {
  return (
    <Stack gap={4}>
      <Text c={'dimmed'} fz={'xs'}>
        {username}
        {' • '}
        <Tooltip
          openDelay={500}
          label={dayjs(createdAt).format('MMMM D, YYYY h:mm A')}
        >
          <Text span inherit>
            {dayjs(createdAt).fromNow()}
          </Text>
        </Tooltip>
      </Text>
      <Title order={2} size={'xl'}>
        {title}
      </Title>
    </Stack>
  );
}
