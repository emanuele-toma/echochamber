import '@mantine/core/styles.css';

import '@mantine/carousel/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/tiptap/styles.css';

import { Navbar } from '@/components/Navbar/Navbar';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

export const metadata = {
  title: 'EchoChamber',
  description: 'Truly one of the all-time alternatives of reddit',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Navbar>{children}</Navbar>
        </MantineProvider>
      </body>
    </html>
  );
}
