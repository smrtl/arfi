import path from "path";
import fs from "fs";
import { test, expect, beforeAll } from "@jest/globals";

import ContractStore from "@/lib/contractStore";

const testPath = path.join(path.dirname(path.dirname(__filename)), "data/test");
const rawContract = {
  address: "0xeefba1e63905ef1d7acba5a8513c70307c1ce441",
  sourceCode:
    "pragma solidity >=0.5.0;\r\npragma experimental ABIEncoderV2;\r\n\r\n/// @title Multicall - Bla bla bla.\r\n/// @author Michael Elliot <mike@makerdao.com>\r\n/// @author Joshua Levine <joshua@makerdao.com>\r\n/// @author Nick Johnson <arachnid@notdot.net>\r\n\r\ncontract Multicall {\r\n    struct Call {\r\n",
  abi: '[{"constant":true,"inputs":[],"name":"getCurrentBlockTimestamp","outputs":[{"name":"timestamp","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"components":[{"name":"target","type":"address"},{"name":"callData","type":"bytes"}],"name":"calls","type":"tuple[]"}],"name":"aggregate","outputs":[{"name":"blockNumber","type":"uint256"},{"name":"returnData","type":"bytes[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]',
  name: "Multicall",
  alias: "multicall",
};

beforeAll(async () => {
  await fs.promises
    .access(testPath, fs.constants.F_OK)
    .then(() => fs.promises.rmdir(testPath, { recursive: true }))
    .catch(() => {});
});

test("add a contract and read it", async () => {
  const store = new ContractStore(testPath);
  await store.add(rawContract);

  const contract = await store.get(rawContract.address);
  expect(contract.alias).toStrictEqual(rawContract.alias);
  expect(contract.name).toStrictEqual(rawContract.name);
  expect(contract.title).toStrictEqual("Multicall - Bla bla bla.");
  expect(contract.hashes).toStrictEqual(["0x0f28c97d", "0x252dba42"]);

  await expect(store.method("toto", rawContract.address)).rejects.toThrow();
  await expect(store.methods("toto")).rejects.toThrow();
  await expect(store.method("0x0f28c97d", "bad")).rejects.toThrow();
  expect(await store.method("0x252dba42", rawContract.address)).toHaveProperty("name", "aggregate");
  expect(await store.methods("0x252dba42").then((r) => r.length)).toBe(1);

  expect(await store.sourceCode(rawContract.address)).toContain("@author Michael Elliot");
});

test("add the same contract and read it again", async () => {
  const store = new ContractStore(testPath);
  await store.add(rawContract);

  const contract = await store.get(rawContract.address);
  expect(contract.alias).toStrictEqual(rawContract.alias);
  expect(await store.method("0x252dba42", rawContract.address)).toHaveProperty("name", "aggregate");
  expect(await store.methods("0x252dba42").then((r) => r.length)).toBe(1);
});
