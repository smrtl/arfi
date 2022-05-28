import { Button, Group, Stack, Title, Paper, Code } from "@mantine/core";

import { useSendApi } from "../lib/hooks/api";

const Ping = () => {
  const { data, error, isLoading, send } = useSendApi("ping");

  const message = () => {
    if (error) return "(error)";
    if (isLoading) return "(loading ...)";
    return data ? JSON.stringify(data) : "(no data)";
  };

  return (
    <Group align="start">
      <Button onClick={() => send()} loading={isLoading}>
        Ping
      </Button>
      <Code block sx={{ flexGrow: 1 }}>
        {message()}
      </Code>
    </Group>
  );
};

export default function Index() {
  return (
    <>
      <Title>Hello World</Title>
      <Paper>
        <Stack>
          <Ping />
        </Stack>
      </Paper>
    </>
  );
}
