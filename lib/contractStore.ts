import fs from "fs";
import path from "path";
import Web3 from "web3";
import { AbiItem } from "web3-utils";

const web3 = new Web3();

const readString = (file: string) => fs.promises.readFile(file, { encoding: "utf8" });
const readJson = (file: string) => readString(file).then((data) => JSON.parse(data));

const writeString = (file: string, data: any) =>
  fs.promises
    .mkdir(path.dirname(file), { recursive: true })
    .then(() => fs.promises.writeFile(file, data));
const writeJson = (file: string, data: any) => writeString(file, JSON.stringify(data));

const parseContractTitle = (source: string) => {
  const m = String(source).match(/@title\s+([^\r\n]+)/);
  return m ? m[1] : null;
};

interface RawContract {
  address: string;
  abi: string;
  alias: string;
  name?: string;
  sourceCode?: string;
}

interface ContractMetadata {
  address: string;
  alias: string;
  name?: string;
  title?: string;
  hashes: string[];
}

interface ContractIndex {
  [address: string]: ContractMetadata;
}

interface HashIndex {
  [hash: string]: { [address: string]: number };
}

export default class ContractStore {
  _indexPath: string;
  _hashIndexPath: string;
  _abiPath: string;
  _sourceCodePath: string;

  _indexData: Promise<ContractIndex>;
  _hashIndexData: Promise<HashIndex>;

  constructor(dataDir: string) {
    this._indexPath = path.join(dataDir, "index.json");
    this._hashIndexPath = path.join(dataDir, "hashes.json");
    this._abiPath = path.join(dataDir, "abi");
    this._sourceCodePath = path.join(dataDir, "sourceCode");
  }

  async _index() {
    if (!this._indexData) this._indexData = readJson(this._indexPath).catch(() => ({}));
    return await this._indexData;
  }

  async _hashIndex() {
    if (!this._hashIndexData) this._hashIndexData = readJson(this._hashIndexPath).catch(() => ({}));
    return await this._hashIndexData;
  }

  abiPath(address: string): string {
    return path.join(this._abiPath, `${address}.json`);
  }

  sourceCodePath(address: string): string {
    return path.join(this._sourceCodePath, `${address}.json`);
  }

  async add(contract: RawContract): Promise<void> {
    const { address, abi: jsonAbi, alias, name, sourceCode } = contract;
    const abi = JSON.parse(jsonAbi);
    // Validate ABI?

    const index = await this._index();
    const hashIndex = await this._hashIndex();

    const title = sourceCode ? parseContractTitle(sourceCode) : undefined;
    const hashes: string[] = abi.map(web3.eth.abi.encodeFunctionSignature);

    // store source code & abi
    if (sourceCode) await writeString(this.sourceCodePath(address), sourceCode);
    await writeString(this.abiPath(address), jsonAbi);

    // update hashIndex
    hashes.forEach((hash, index) => {
      if (!hashIndex[hash]) hashIndex[hash] = {};
      hashIndex[hash][address] = index;
    });
    await writeJson(this._hashIndexPath, hashIndex);

    // update index
    index[address] = { address, alias, name, title, hashes };
    await writeJson(this._indexPath, index);
  }

  async list(): Promise<ContractMetadata[]> {
    const index = await this._index();
    return Object.values(index);
  }

  async get(address: string): Promise<ContractMetadata> {
    const index = await this._index();
    if (!index[address]) throw new Error(`Contract not found: ${address}`);
    return index[address];
  }

  async abi(address: string): Promise<AbiItem[]> {
    return await readJson(this.abiPath(address));
  }

  async sourceCode(address: string): Promise<string> {
    return await readString(this.sourceCodePath(address));
  }

  async method(hash: string, address: string): Promise<AbiItem> {
    const hashIndex = await this._hashIndex();
    if (!hashIndex[hash]) throw new Error(`Method not found: ${hash}`);

    const contracts = hashIndex[hash];
    if (contracts[address] === undefined)
      throw new Error(`The method '${hash}' not found in contract: ${address}`);

    const abi = await this.abi(address);
    return abi[contracts[address]];
  }

  async methods(hash: string): Promise<AbiItem[]> {
    const hashIndex = await this._hashIndex();
    if (!hashIndex[hash]) throw new Error(`Method not found: ${hash}`);

    return Promise.all(
      Object.entries(hashIndex[hash]).map(
        async ([address, index]) => (await this.abi(address))[index]
      )
    );
  }
}
