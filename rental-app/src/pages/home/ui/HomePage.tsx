import { useEffect, useState } from 'react';
import { Container, Title, Text, SimpleGrid, Space, Loader } from "@mantine/core";
import { PropertyCard } from "../../../entities/property";
import api from '../../../shared/api';
import type { Property } from "../types";

export function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get('/properties/');
        setProperties(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке квартир:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <Container py="xl"><Loader /></Container>;
  }

  return (
    <Container size="lg" py="xl">
      <Title order={1}>Найдите жильё для аренды</Title>
      <Text c="dimmed" mt="xs">
        Актуальные объявления
      </Text>

      <Space h="xl" />

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {properties.length === 0 ? (
          <Text>Пока нет объявлений</Text>
        ) : (
          properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        )}
      </SimpleGrid>
    </Container>
  );
}