import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  Avatar,
  Button,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Paper,
  Text,
} from '@mantine/core';
import { IconLogin2 } from '@tabler/icons-react';

interface NavbarProps {
  children: React.ReactNode;
}

export function Navbar({ children }: NavbarProps) {
  return (
    <AppShell header={{ height: 60 }} padding={'md'}>
      <AppShellHeader px={'sm'}>
        <Group justify="space-between" h={'100%'}>
          <Group align="center" h={'100%'}>
            <Paper radius={'xl'} w={32} h={32} bg={'blue'} />
            <Text fw={500} fz={20}>
              EchoChamber
            </Text>
          </Group>
          <Menu>
            <MenuTarget>
              <Button p={0} radius={'xl'} variant="transparent">
                <Avatar size={32} />
              </Button>
            </MenuTarget>
            <MenuDropdown>
              <MenuItem leftSection={<IconLogin2 size={18} />}>
                Sign in
              </MenuItem>
            </MenuDropdown>
          </Menu>
        </Group>
      </AppShellHeader>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
