import {
  Accordion,
  Text,
  Group,
  Paper,
  Skeleton,
  Tabs,
  TextInput,
  Button,
  Modal,
} from "@mantine/core";
import { Prism } from "@mantine/prism";
import { useRouter } from "next/router";
import { AbiItem } from "web3-utils";
import { Trash, X } from "tabler-icons-react";
import { useState } from "react";
import { mutate } from "swr";

import PageTitle from "@/components/PageTitle";
import { useApi, useSendApi } from "@/lib/hooks/api";
import toYaml from "@/lib/utils/yaml";

const abiItemSorter = (a: AbiItem, b: AbiItem) => {
  if (a.type > b.type) return 1;
  if (a.type < b.type) return -1;
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
};

const AbiItemLabel = ({ item }) => (
  <Group noWrap>
    <Text size="sm" color="dimmed">
      {item.type}
    </Text>
    <Text size="sm">{item.name}</Text>
  </Group>
);

export default function Contracts() {
  const { query, push } = useRouter();
  const { data: { address, title, name, alias, abi = [], sourceCode } = {}, isValidating } = useApi(
    `/contracts/${query.address}`
  );
  const [confirmOpened, setConfirmOpened] = useState(false);
  const { del } = useSendApi(`/contracts/${query.address}`);

  const deleteContract = () => {
    del().then(() => {
      mutate("/contracts");
      push("/contracts");
    });
  };

  return (
    <>
      <PageTitle label={title}>
        <Button leftIcon={<Trash />} color="red" onClick={() => setConfirmOpened(true)}>
          Delete
        </Button>
      </PageTitle>
      <Paper>
        <Skeleton visible={isValidating}>
          <TextInput value={address} label="Address" readOnly></TextInput>
          <TextInput value={alias} label="Alias" readOnly></TextInput>
          <TextInput value={name} label="Name" readOnly></TextInput>
          <Tabs>
            <Tabs.Tab label="ABI">
              <Accordion multiple styles={{ control: { padding: 5 } }}>
                {abi.sort(abiItemSorter).map((item: AbiItem) => (
                  <Accordion.Item key={item.name} label={<AbiItemLabel item={item} />}>
                    <Prism language="yaml">{toYaml(item)}</Prism>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Tabs.Tab>
            <Tabs.Tab label="Source Code">
              <Prism language="python">{sourceCode}</Prism>
            </Tabs.Tab>
          </Tabs>
        </Skeleton>
      </Paper>
      <Modal
        opened={confirmOpened}
        onClose={() => setConfirmOpened(false)}
        withCloseButton={false}
        centered
      >
        <Text pb="md">Are you sure you want to delete this contract ?</Text>
        <Group position="right">
          <Button leftIcon={<X />} onClick={() => setConfirmOpened(false)}>
            No, cancel
          </Button>
          <Button leftIcon={<Trash />} color="red" onClick={deleteContract}>
            Yes, delete it
          </Button>
        </Group>
      </Modal>
    </>
  );
}
