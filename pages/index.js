import useApi from "../lib/hooks/api";

const Ping = () => {
  const { data, error, isValidating, mutate } = useApi("ping");

  if (error) return <div>Error :(</div>;
  if (isValidating) return <div>Loading...</div>;
  return (
    <div>
      <button onClick={(e) => mutate()}>Ping</button>
      {JSON.stringify(data)}
    </div>
  );
};

export default function Index() {
  return (
    <div>
      <h1>Hello World</h1>
      <Ping />
    </div>
  );
}
