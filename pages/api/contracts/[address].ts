import endpoint, { Success } from "@/lib/endpoint";
import { contractStore } from "@/lib/services";

export default endpoint({
  deleteQuery: { address: "required|length:42,42" },
  delete: async ({ query: { address } }) => {
    await contractStore.delete(address);
    return Success(address);
  },
});
