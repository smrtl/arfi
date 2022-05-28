import { useEffect, useState, useCallback } from "react";
import {
  Table,
  Title,
  Code,
  Text,
  Group,
  Button,
  Space,
  Drawer,
  TextInput,
  Stepper,
  Textarea,
  JsonInput,
} from "@mantine/core";
import { ArrowRight, Plus, Trash, X } from "tabler-icons-react";
import { useForm } from "@mantine/form";

import { useApi, useSendApi } from "../lib/hooks/api";

const ContractDetailDrawer = ({ contract, onClose, mutateContracts }) => {
  const { address = "", alias = "", name = "", title = "" } = contract || {};
  const { isLoading: isDeleting, del } = useSendApi(`/contracts/${address}`);

  const deleteContract = () => {
    del().then(() => {
      mutateContracts();
      onClose();
    });
  };

  return (
    <Drawer
      title="Contract Detail"
      withCloseButton={false}
      closeOnClickOutside={!isDeleting}
      closeOnEscape={!isDeleting}
      opened={!!contract}
      onClose={onClose}
      padding="lg"
      size={500}
      position="right"
    >
      <TextInput label="Address" value={address} readOnly />
      <TextInput label="Alias" value={alias} readOnly />
      <TextInput label="Title" value={title} readOnly />
      <TextInput label="Name" value={name} readOnly />
      {/* <JsonInput label="ABI" value={"[]"} readOnly minRows={10} />
      <Textarea
        label="Source Code"
        value={"sourceCode"}
        readOnly
        minRows={10}
        styles={{ input: { fontFamily: "monospace", fontSize: 12 } }}
      /> */}
      <Group position="right" pt="md">
        <Button leftIcon={<Trash />} loading={isDeleting} color="red" onClick={deleteContract}>
          Delete
        </Button>
        <Button leftIcon={<X />} onClick={onClose} disabled={isDeleting}>
          Close
        </Button>
      </Group>
    </Drawer>
  );
};

const ImportContractDrawer = ({ opened, onClose, mutateContracts }) => {
  const {
    data: contractData,
    get: getContractData,
    isLoading: isContractDataLoading,
    clear: clearContractData,
  } = useSendApi("contracts/fetchInfo");
  const {
    isLoading: isImporting,
    isLoaded: isImported,
    post: importContract,
  } = useSendApi("contracts/import");

  const clearAndClose = (mutate: boolean = false) => {
    console.log("clear and close", mutate);
    clearContractData();
    if (mutate) mutateContracts();
    onClose();
  };

  const step1Form = useForm({
    initialValues: { address: "" },
    validate: {
      address: (value: string) => (value && value.length == 42 ? null : "Invalid address"),
    },
  });

  const step2Form = useForm({
    initialValues: { address: "", name: "", abi: "", sourceCode: "", alias: "" },
    validate: {
      alias: (value: string) =>
        value && value.length > 2 ? null : "The alias must contain at least 3 characters.",
    },
  });

  useEffect(() => {
    if (contractData)
      step2Form.setValues({
        ...contractData,
        alias: (contractData.name || "")
          .toLowerCase()
          .replace(/[^a-z0-9]/, "-")
          .replace(/-+/, "-"),
      });
  }, [contractData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isImported) clearAndClose(true);
  }, [isImported]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Drawer
      title="Import Contract"
      withCloseButton={false}
      closeOnClickOutside={!isContractDataLoading && !isImporting}
      closeOnEscape={!isContractDataLoading && !isImporting}
      opened={opened}
      onClose={onClose}
      padding="lg"
      size={500}
      position="right"
    >
      <Stepper active={contractData ? 1 : 0} py="md">
        <Stepper.Step label="Import">
          <form onSubmit={step1Form.onSubmit(getContractData)}>
            <TextInput
              label="Contract address"
              placeholder="0x0000000000000000000000000000000000000000"
              {...step1Form.getInputProps("address")}
            />
            <Group position="right" pt="md">
              <Button
                leftIcon={<X />}
                variant="light"
                disabled={isContractDataLoading}
                onClick={() => clearAndClose()}
              >
                Cancel
              </Button>
              <Button leftIcon={<ArrowRight />} loading={isContractDataLoading} type="submit">
                Next
              </Button>
            </Group>
          </form>
        </Stepper.Step>
        <Stepper.Step label="Review">
          <form onSubmit={step2Form.onSubmit(importContract)}>
            <TextInput label="Name" {...step2Form.getInputProps("name")} />
            <JsonInput label="ABI" minRows={10} readOnly {...step2Form.getInputProps("abi")} />
            <Textarea
              label="Source Code"
              minRows={10}
              styles={{ input: { fontFamily: "monospace", fontSize: 12 } }}
              readOnly
              {...step2Form.getInputProps("sourceCode")}
            />
            <TextInput label="Alias" {...step2Form.getInputProps("alias")} />
            <Group position="right" pt="md">
              <Button
                leftIcon={<X />}
                variant="light"
                disabled={isImporting}
                onClick={() => clearAndClose()}
              >
                Cancel
              </Button>
              <Button leftIcon={<Plus />} loading={isImporting} type="submit">
                Import
              </Button>
            </Group>
          </form>
        </Stepper.Step>
      </Stepper>
    </Drawer>
  );
};

export default function Contracts() {
  const { data: contracts, mutate: mutateContracts } = useApi("contracts");
  const [importOpened, setImportOpened] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  return (
    <div>
      <Group position="apart" align="flex-end" px="xs">
        <Title>Contracts</Title>
        <Button leftIcon={<Plus />} onClick={() => setImportOpened(true)}>
          Import Contract
        </Button>
      </Group>
      <Space h="xl" />
      {contracts && (
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract: any) => {
              const { address, title, alias } = contract;
              return (
                <tr
                  key={address}
                  onClick={() => setSelectedContract(contract)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <Text size="sm">{title}</Text>
                    <Text color="dimmed" size="sm">
                      {alias}
                    </Text>
                  </td>
                  <td valign="top">
                    <Code>{address}</Code>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      <ContractDetailDrawer
        contract={selectedContract}
        onClose={() => setSelectedContract(null)}
        mutateContracts={mutateContracts}
      />
      <ImportContractDrawer
        opened={importOpened}
        onClose={() => setImportOpened(false)}
        mutateContracts={mutateContracts}
      />
    </div>
  );
}
