import '@mantine/core/styles.css';

import '@mantine/carousel/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/tiptap/styles.css';

import { Navbar } from '@/components/Navbar';
import { ReactQueryProvider } from '@/components/ReactQueryProvider';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

export const metadata = {
  title: 'EchoChamber',
  description: 'Truly one of the all-time alternatives of reddit',
};

interface PageProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: PageProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <ReactQueryProvider>
          <MantineProvider defaultColorScheme="auto">
            <Navbar>{children}</Navbar>
          </MantineProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
