import endpoint, { Success } from "@/lib/endpoint";

export default endpoint({
  get: () => Success("pong"),
});
