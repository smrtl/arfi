import path from "path";
import Web3 from "web3";

import ContractStore from "./contractStore";
import { DATA_STORE_DIR } from "./settings";

export const web3 = new Web3("https://rpc.ankr.com/eth");
export const contractStore = new ContractStore(path.join(DATA_STORE_DIR, "contracts"));
