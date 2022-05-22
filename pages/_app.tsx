import { AppProps } from "next/app";
import Head from "next/head";
import Image from "next/image";
import {
  ActionIcon,
  AppShell,
  Container,
  Group,
  Header,
  MantineProvider,
  Navbar,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { useState } from "react";
import { Sun, MoonStars, DeviceAnalytics, GitPullRequest } from "tabler-icons-react";

const Logo = () => <Image src="/logo.svg" width={96} height={31} layout="fixed" alt="arfi" />;
const NavItem = ({ Icon, label }) => (
  <UnstyledButton
    sx={(theme) => ({
      display: "block",
      width: "100%",
      padding: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

      "&:hover": {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
      },
    })}
  >
    <Group spacing="sm">
      <ThemeIcon variant="light">
        <Icon size={16} />
      </ThemeIcon>
      <Text size="sm">{label}</Text>
    </Group>
  </UnstyledButton>
);

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [darkTheme, setDarkTheme] = useState(true);

  return (
    <>
      <Head>
        <title>Arfi</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme: darkTheme ? "dark" : "light" }}
        defaultProps={{
          Title: { mb: "xl" },
        }}
      >
        <AppShell
          padding="md"
          header={
            <Header height={60} p="xs">
              <Group sx={{ height: "100%" }} px="sm" position="apart">
                <Logo />
                <ActionIcon variant="default" onClick={() => setDarkTheme(!darkTheme)} size={30}>
                  {darkTheme ? <Sun size={16} /> : <MoonStars size={16} />}
                </ActionIcon>
              </Group>
            </Header>
          }
          navbar={
            <Navbar width={{ base: 200 }} p="md">
              <Navbar.Section>
                <NavItem Icon={DeviceAnalytics} label="Analyze stuff" />
                <NavItem Icon={GitPullRequest} label="This is a link" />
              </Navbar.Section>
            </Navbar>
          }
          styles={(theme) => ({
            main: {
              backgroundColor: darkTheme ? theme.colors.dark[8] : theme.colors.gray[0],
            },
          })}
        >
          <Component {...pageProps} />
        </AppShell>
      </MantineProvider>
    </>
  );
}
