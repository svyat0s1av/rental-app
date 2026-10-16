import { Container, Title, Text, SimpleGrid, Space } from "@mantine/core";
import { PropertyCard } from "../components/PropertyCard";
import { demoProperties } from "../data/demo";

export function HomePage() {
  return (
    <Container size="lg" py="xl">
      <Title order={1}>Найдите жильё для аренды</Title>
      <Text c="dimmed" mt="xs">
        Актуальные объявления от арендодателей
      </Text>

      <Space h="xl" />

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {demoProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </SimpleGrid>
    </Container>
  );
}