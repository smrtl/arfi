import { Container, Button, Group, Stack, Textarea, Title, Paper } from "@mantine/core";

import useApi from "../lib/hooks/api";

const Ping = () => {
  const { data, error, isValidating, mutate } = useApi("ping");

  const message = () => {
    if (error) return "Error :(";
    if (isValidating) return "Loading...";
    return JSON.stringify(data);
  };

  return (
    <Group align="start">
      <Button onClick={() => mutate()} disabled={isValidating}>
        Ping
      </Button>
      <Textarea disabled value={message()} style={{ width: 400 }}></Textarea>
    </Group>
  );
};

export default function Index() {
  return (
    <>
      <Title>Hello World</Title>
      <Paper p="md">
        <Stack>
          <Ping />
        </Stack>
      </Paper>
    </>
  );
}
