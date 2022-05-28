import endpoint, { NoContent } from "@/lib/endpoint";
import { contractStore } from "@/lib/services";

export default endpoint({
  postBody: {
    address: "required|length:42,42",
    alias: "required|minLength:3",
    name: "string",
    abi: "required|minLength:2",
    sourceCode: "string",
  },
  post: async ({ body: { address, alias, name, abi, sourceCode } }) => {
    await contractStore.add({ address, alias, name, abi, sourceCode });
    return NoContent();
  },
});
