import { Group, Title } from "@mantine/core";

const PageTitle = ({ label, children = null }) => {
  return (
    <Group position="apart" align="flex-end" pb="xl">
      <Title>{label}</Title>
      {children}
    </Group>
  );
};

export default PageTitle;
