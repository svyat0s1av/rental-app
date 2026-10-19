import { ActionIcon, Badge, Button, Card, Group, Image, Text } from '@mantine/core';
import type { Property } from "../types";
import { IconHeart } from '@tabler/icons-react';
import classes from "./PropertyCard.module.scss";
import { Link } from "react-router-dom";
import { Carousel } from '@mantine/carousel';

interface Props {
  property: Property;
}

export function PropertyCard({ property }: Props) {
  const { images, title, description, address, rooms, area, price } = property;
  
  const slides = images.map((image, index) => (
    <Carousel.Slide key={image}>
      <Image src={image} height={220} alt={`Slide ${index + 1}`} />
    </Carousel.Slide>
  ));

  return (
    <Card radius="md" withBorder padding="md">
       <Card.Section>
        <Carousel
          withIndicators
          emblaOptions={{ loop: true }}
          classNames={{
            root: classes.carousel,
            controls: classes.carouselControls,
            indicator: classes.carouselIndicator,
          }}
          previousControlProps={{ 'aria-label': 'Previous slide' }}
          nextControlProps={{ 'aria-label': 'Next slide' }}
        >
          {slides}
        </Carousel>
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Text fz="xl" fw={500} lineClamp={1}>
          {title}
        </Text>
        <Text fz="sm" fw={400} c="dimmed">
          {address}
        </Text>
        <Text fz="sm" mt="xs" lineClamp={2}>
          {description}
        </Text>
      </Card.Section>

      <Group gap="xs" mt="md">
        <Badge variant="light">{rooms} комн.</Badge>
        <Badge variant="light">{area} м²</Badge>
      </Group>

      <Group mt="md" justify="space-between" align="center">
        <Text fw={700} size="lg">
          {price.toLocaleString("ru-RU")} ₽/мес
        </Text>
        <Group gap="xs">
          <Button component={Link} to={`/property/${property.id}`} radius="md">
            Подробнее
          </Button>
          <ActionIcon variant="default" radius="md" size={36} aria-label="Like">
            <IconHeart stroke={1.5} />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );
}