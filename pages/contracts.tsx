import { useEffect, useState } from "react";
import {
  Table,
  Code,
  Text,
  Group,
  Button,
  Drawer,
  TextInput,
  Stepper,
  Textarea,
  JsonInput,
} from "@mantine/core";
import { ArrowRight, Plus, X } from "tabler-icons-react";
import { useForm } from "@mantine/form";

import { useApi, useSendApi } from "../lib/hooks/api";
import PageTitle from "@/components/PageTitle";
import ALink from "@/components/ALink";

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
              required
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
            <TextInput label="Name" readOnly {...step2Form.getInputProps("name")} />
            <JsonInput label="ABI" minRows={10} readOnly {...step2Form.getInputProps("abi")} />
            <Textarea
              label="Source Code"
              minRows={10}
              styles={{ input: { fontFamily: "monospace", fontSize: 12 } }}
              readOnly
              {...step2Form.getInputProps("sourceCode")}
            />
            <TextInput label="Alias" required {...step2Form.getInputProps("alias")} />
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

  return (
    <div>
      <PageTitle label="Contracts">
        <Button leftIcon={<Plus />} onClick={() => setImportOpened(true)}>
          Import Contract
        </Button>
      </PageTitle>
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
                <tr key={address}>
                  <td>
                    <ALink href={`/contracts/${address}`}>
                      <Text size="sm">{title}</Text>
                      <Text color="dimmed" size="sm">
                        {alias}
                      </Text>
                    </ALink>
                  </td>
                  <td valign="top">
                    <ALink href={`/contracts/${address}`}>
                      <Code>{address}</Code>
                    </ALink>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      <ImportContractDrawer
        opened={importOpened}
        onClose={() => setImportOpened(false)}
        mutateContracts={mutateContracts}
      />
    </div>
  );
}
