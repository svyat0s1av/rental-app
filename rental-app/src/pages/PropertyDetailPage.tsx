import { Container, Title, Text, Button, Image, Badge, Group } from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import { demoProperties } from "../data/demo";

export function PropertyDetailPage() {
  const { id } = useParams();
  const property = demoProperties.find((p) => p.id === Number(id));
  const navigate = useNavigate();

  if (!property) {
    return <Container py="xl"><Title>Квартира не найдена</Title></Container>;
  }

  return (
    <Container size="md" py="xl">
    <Button variant="subtle" onClick={() => navigate(-1)} mb="md"> &lt; Назад</Button>
    <Group justify="space-between" align="center" mb="md">
        <Title order={1}>{property.title}</Title>
        <Button size="md" color="blue">
          Забронировать
        </Button>
      </Group>
    <Image src={property.image} alt={property.title} height={350} radius="md" mb="lg" mt={100}/>
    <Text mt={100} fz="lg">Адрес: {property.address}</Text>
    <Text mt="md" fz="lg">{property.description}</Text>
    <Group justify="Flex-start" align="center" mb="md" mt={50}>
        <Badge size="xl" variant="light">{property.area} м²</Badge>
        <Badge size="xl" variant="light">{property.rooms} комнатная</Badge>
    </Group>    
    <Title order={3} mt="lg">{property.price} ₽/мес</Title>
    </Container>
  );
}