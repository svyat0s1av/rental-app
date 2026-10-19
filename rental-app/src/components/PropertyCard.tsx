import { ActionIcon, Badge, Button, Card, Group, Image, Text } from '@mantine/core';
import type { Property } from "../types";
import { IconHeart } from '@tabler/icons-react';
import classes from "./PropertyCard.module.css";
import { Link } from "react-router-dom";

interface Props {
  property: Property;
}

export function PropertyCard({ property }: Props) {
  const { image, title, description, address, rooms, area, price } = property;

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Image src={image} alt={title} height={180} />
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
          <Text fz="xl" fw={500}>
            {title}
          </Text>
          <Text fz="lg" fw={400}>
            {address}
          </Text>
        <Text fz="sm" mt="xs">
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
          <Button component={Link} to={`/property/${property.id}`} radius="md">Подробнее</Button>
          <ActionIcon variant="default" radius="md" size={36} aria-label="Like">
            <IconHeart stroke={1.5} />
          </ActionIcon>
        </Group>
        </Group>
    </Card>
  );
}