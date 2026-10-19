import { useState } from "react";
import { 
  Avatar, Container, Group, Text, Title, Tabs, Button 
} from "@mantine/core";
import { 
  IconBuilding, IconFileText, IconCreditCard, IconFolder, IconPlus 
} from "@tabler/icons-react";

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<string | null>("objects");

  return (
    <Container size="lg" py="xl">
      <Group mb="xl" pb="md" style={{ borderBottom: "1px solid #eee" }} justify="space-between">
        <Group>
          <Avatar size={80} radius="xl" color="blue">
            А
          </Avatar>
          <div>
            <Title order={2}>Имя Пользователя</Title>
            <Text c="dimmed" fz="sm">email@example.com</Text>
          </div>
        </Group>
        <Button leftSection={<IconPlus size={16} />} radius="md">
          Добавить объект
        </Button>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} variant="outline">
        <Tabs.List mb="lg">
          <Tabs.Tab value="objects" leftSection={<IconBuilding size={16} />}>
            Мои объекты
          </Tabs.Tab>
          <Tabs.Tab value="contracts" leftSection={<IconFileText size={16} />}>
            Договоры
          </Tabs.Tab>
          <Tabs.Tab value="payments" leftSection={<IconCreditCard size={16} />}>
            Платежи
          </Tabs.Tab>
          <Tabs.Tab value="documents" leftSection={<IconFolder size={16} />}>
            Документы
          </Tabs.Tab>
        </Tabs.List>


        <Tabs.Panel value="objects">
          <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed #ccc', borderRadius: '8px' }}>
            <Text c="dimmed">Ваша недвижимость</Text>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="contracts">
          <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed #ccc', borderRadius: '8px' }}>
            <Text c="dimmed">Договоров пока нет</Text>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="payments">
          <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed #ccc', borderRadius: '8px' }}>
            <Text c="dimmed">Платежей пока нет</Text>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="documents">
          <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed #ccc', borderRadius: '8px' }}>
            <Text c="dimmed">Документов пока нет</Text>
          </div>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}