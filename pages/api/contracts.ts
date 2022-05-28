import endpoint, { Success } from "@/lib/endpoint";
import { contractStore } from "@/lib/services";

export default endpoint({
  get: async () => {
    const contracts = await contractStore.list();
    return Success(contracts);
  },
});
