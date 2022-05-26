import axios from "axios";

export const fetchContract = async (address: string) => {
  const contract = await axios.get("https://api.etherscan.io/api", {
    params: {
      module: "contract",
      action: "getsourcecode",
      address,
    },
  });

  if (!contract.data || !contract.data.result || contract.data.result.length < 1)
    throw Error(`Failed to fetch contract\n\n${JSON.stringify(contract.data)}`);

  return contract.data.result[0];
};
