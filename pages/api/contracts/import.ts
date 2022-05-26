import endpoint, { Success } from "@/lib/endpoint";
import { contractStore } from "@/lib/services";
import { fetchContract } from "@/lib/apis/etherscan";

export default endpoint({
  query: { name: "required|minLength:3", address: "required|length:42,42" },
  get: async ({ query: { name: alias, address } }) => {
    const rawContract = await fetchContract(address);
    await contractStore.add({
      address,
      alias,
      name: rawContract.ContractName,
      abi: rawContract.ABI,
      sourceCode: rawContract.SourceCode,
    });

    const { name, title } = await contractStore.get(address);
    return Success({ alias, name, title });
  },
});
