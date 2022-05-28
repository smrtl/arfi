import endpoint, { Success } from "@/lib/endpoint";
import { fetchContract } from "@/lib/apis/etherscan";

export default endpoint({
  getQuery: { address: "required|length:42,42" },
  get: async ({ query: { address } }) => {
    const rawContract = await fetchContract(address);

    return Success({
      address,
      name: rawContract.ContractName,
      sourceCode: rawContract.SourceCode,
      abi: rawContract.ABI,
    });
  },
});
