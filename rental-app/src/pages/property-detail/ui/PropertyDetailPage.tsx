import { useEffect, useState } from 'react';
import { Carousel } from '@mantine/carousel';
import { Container, Title, Text, Button, Image, Badge, Group, Loader } from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import api, { BACKEND_URL } from '../../../shared/api';
import type { Property } from '../types';

export function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleBook = async () => {
    try {
      const startDate = new Date().toISOString();
      const endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();

      await api.post('/contracts/', {
        property_id: Number(id),
        start_date: startDate,
        end_date: endDate
      });

      alert("Договор успешно создан!");
      navigate('/profile');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        alert(`Ошибка: ${error.response.data.detail}`);
      } else {
        alert("Ошибка: убедитесь, что вы вошли в систему.");
      }
    }
  };


  if (loading) return <Container py="xl"><Loader /></Container>;
  if (!property) return <Container py="xl"><Title>Квартира не найдена</Title></Container>;

  const slides = property.images && property.images.length > 0 ? property.images.map((image, index) => (
    <Carousel.Slide key={image.id}>
      <Image
        src={image.url.startsWith('http') ? image.url : `${BACKEND_URL}${image.url}`}
        height={400}
        alt={`${property.title} фото ${index + 1}`}
      />
    </Carousel.Slide>
  )) : [
    <Carousel.Slide key="placeholder">
      <Image src="https://placehold.co" height={400} alt="Нет фото" />
    </Carousel.Slide>
  ];

  return (
    <Container size="md" py="xl">
      <Button variant="subtle" onClick={() => navigate(-1)} mb="md">&lt; Назад</Button>
      <Group justify="space-between" align="center" mb="md">
        <Title order={1}>{property.title}</Title>
        <Button size="md" color="blue" onClick={handleBook}>
          Забронировать
        </Button>
      </Group>

      <Carousel pos="relative" withIndicators height={400} emblaOptions={{ loop: true }} mb="lg">
        {slides}
      </Carousel>

      <Text mt={50} fz="lg">Адрес: {property.address}</Text>
      <Text mt="md" fz="lg">{property.description}</Text>
      <Group justify="flex-start" align="center" mb="md" mt={50}>
        <Badge size="xl" variant="light">{property.area} м²</Badge>
        <Badge size="xl" variant="light">{property.rooms} комнатная</Badge>
      </Group>
      <Title order={3} mt="lg">{property.price.toLocaleString("ru-RU")} ₽/мес</Title>
    </Container>
  );
}
