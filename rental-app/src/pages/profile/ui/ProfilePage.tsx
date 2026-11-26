import { useState, useEffect } from "react";
import {
  Avatar,
  Container,
  Group,
  Text,
  Title,
  Tabs,
  Button,
  Modal,
  TextInput,
  NumberInput,
  SimpleGrid,
  FileInput,
  Card,
  Badge,
  Select,
  Anchor,
  Stack,
} from "@mantine/core";
import {
  IconBuilding,
  IconFileText,
  IconCreditCard,
  IconFolder,
  IconPlus,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PropertyCard } from "../../../entities/property";
import type { Property, User, Contract, Payment } from "../types";
import api, { BACKEND_URL } from "../../../shared/api";

export function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | null>("objects");
  const [opened, setOpened] = useState(false);
  const [paymentModalOpened, setPaymentModalOpened] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [rooms, setRooms] = useState<number | string>("");
  const [area, setArea] = useState<number | string>("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | string>("");
  const [paymentDescription, setPaymentDescription] = useState("");

  const fetchProfileData = async () => {
    try {
      const userRes = await api.get("/users/me");
      setUser(userRes.data);
      if (userRes.data.role === "renter") {
        setActiveTab((prev) => (prev === "objects" ? "contracts" : prev));
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
    }

    try {
      const propsRes = await api.get("/properties/my");
      setMyProperties(propsRes.data);
    } catch (error) {
      console.error(error);
    }

    try {
      const contractsRes = await api.get("/contracts/my");
      const loadedContracts: Contract[] = contractsRes.data;
      setContracts(loadedContracts);

      const paymentsLists = await Promise.all(
        loadedContracts.map((c) =>
          api.get(`/payments/contract/${c.id}`).then((res) => res.data).catch(() => [])
        )
      );
      setPayments(paymentsLists.flat());
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleCreateProperty = async () => {
    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await api.post("/files/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedUrls.push(uploadRes.data.url);
      }

      await api.post("/properties/", {
        title,
        address,
        price: Number(price),
        rooms: Number(rooms),
        area: Number(area),
        description: description || "Без описания",
        image_urls: uploadedUrls,
      });

      setOpened(false);
      setTitle("");
      setAddress("");
      setPrice("");
      setRooms("");
      setArea("");
      setDescription("");
      setFiles([]);
      fetchProfileData();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert("Ошибка при добавлении объекта. Проверьте заполнение всех полей.");
      }
    }
  };

  const handleCreatePayment = async () => {
    if (!selectedContractId || !paymentAmount) {
      alert("Выберите договор и укажите сумму");
      return;
    }
    try {
      await api.post("/payments/", {
        contract_id: Number(selectedContractId),
        amount: Number(paymentAmount),
        description: paymentDescription || "Оплата аренды",
      });
      setPaymentModalOpened(false);
      setSelectedContractId(null);
      setPaymentAmount("");
      setPaymentDescription("");
      fetchProfileData();
    } catch (error) {
      alert("Ошибка при создании платежа");
    }
  };

  const handleUploadReceipt = async (paymentId: number, file: File | null) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await api.patch(`/payments/${paymentId}/receipt`, {
        receipt_url: uploadRes.data.url,
      });
      fetchProfileData();
    } catch (error) {
      alert("Ошибка при загрузке чека");
    }
  };

  const handleUploadContractDoc = async (contractId: number, file: File | null) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await api.patch(`/contracts/${contractId}/document`, {
        document_url: uploadRes.data.url,
      });
      fetchProfileData();
    } catch (error) {
      alert("Ошибка при загрузке документа");
    }
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    draft: { label: "Черновик", color: "gray" },
    signed: { label: "Подписан", color: "blue" },
    active: { label: "Активен", color: "green" },
    closed: { label: "Закрыт", color: "red" },
  };

  const paymentStatusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: "Ожидает оплаты", color: "orange" },
    paid: { label: "Оплачен", color: "green" },
    confirmed: { label: "Подтвержден", color: "blue" },
  };

  return (
    <Container size="lg" py="xl">
      <Group mb="xl" pb="md" style={{ borderBottom: "1px solid #eee" }} justify="space-between">
        <Group>
          <Avatar size={80} radius="xl" color="blue">
            {user?.full_name ? user.full_name.toUpperCase() : "П"}
          </Avatar>
          <div>
            <Title order={2}>{user?.full_name || "Мой профиль"}</Title>
            <Text c="dimmed" fz="sm">
              {user?.email} • {user?.role === "owner" ? "Арендодатель" : "Арендатор"}
            </Text>
          </div>
        </Group>
        {user?.role === "owner" && (
          <Button leftSection={<IconPlus size={16} />} radius="md" onClick={() => setOpened(true)}>
            Добавить объект
          </Button>
        )}
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} variant="outline">
        <Tabs.List mb="lg">
          {user?.role === "owner" && (
            <Tabs.Tab value="objects" leftSection={<IconBuilding size={16} />}>
              Мои объекты
            </Tabs.Tab>
          )}
          <Tabs.Tab value="contracts" leftSection={<IconFileText size={16} />}>
            Договоры ({contracts.length})
          </Tabs.Tab>
          <Tabs.Tab value="payments" leftSection={<IconCreditCard size={16} />}>
            Платежи ({payments.length})
          </Tabs.Tab>
          <Tabs.Tab value="documents" leftSection={<IconFolder size={16} />}>
            Документы
          </Tabs.Tab>
        </Tabs.List>

        {user?.role === "owner" && (
          <Tabs.Panel value="objects">
            {loading ? (
              <Text c="dimmed">Загрузка...</Text>
            ) : myProperties.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", border: "1px dashed #ccc", borderRadius: "8px" }}>
                <Text c="dimmed">У вас пока нет добавленных объектов</Text>
              </div>
            ) : (
                            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {myProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </SimpleGrid>
            )}
          </Tabs.Panel>
        )}

        <Tabs.Panel value="contracts">
          {contracts.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", border: "1px dashed #ccc", borderRadius: "8px" }}>
              <Text c="dimmed">Договоров пока нет</Text>
            </div>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {contracts.map((contract) => {
                const normalizedStatus = contract.status.toLowerCase();
                const statusInfo = statusLabels[normalizedStatus] || {
                  label: contract.status,
                  color: "blue",
                };

                return (
                  <Card key={contract.id} withBorder radius="md" padding="md">
                    <Group justify="space-between" mb="xs">
                      <Text fw={600}>Договор №{contract.id}</Text>
                      <Badge color={statusInfo.color}>{statusInfo.label}</Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                      Объект ID: {contract.property_id}
                    </Text>
                    <Text size="sm" mt="xs">
                      Период: {new Date(contract.start_date).toLocaleDateString("ru-RU")} —{" "}
                      {new Date(contract.end_date).toLocaleDateString("ru-RU")}
                    </Text>
                  </Card>
                );
              })}
            </SimpleGrid>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="payments">
          {user?.role === "owner" && contracts.length > 0 && (
            <Group justify="flex-end" mb="md">
              <Button leftSection={<IconPlus size={16} />} size="sm" onClick={() => setPaymentModalOpened(true)}>
                Выставить счет
              </Button>
            </Group>
          )}

          {payments.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", border: "1px dashed #ccc", borderRadius: "8px" }}>
              <Text c="dimmed">Платежей пока нет</Text>
            </div>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {payments.map((payment) => {
                const normalizedStatus = payment.status.toLowerCase();
                const statusInfo = paymentStatusLabels[normalizedStatus] || {
                  label: payment.status,
                  color: "gray",
                };

                return (
                  <Card key={payment.id} withBorder radius="md" padding="md">
                    <Group justify="space-between" mb="xs">
                      <Text fw={600}>Платеж №{payment.id}</Text>
                      <Badge color={statusInfo.color}>{statusInfo.label}</Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                      Договор №{payment.contract_id} • {payment.description}
                    </Text>
                    <Text fw={700} size="lg" mt="xs" mb="sm">
                      {payment.amount.toLocaleString("ru-RU")} ₽
                    </Text>

                    {payment.receipt_url ? (
                      <Anchor
                        href={`${BACKEND_URL}${payment.receipt_url}`}
                        target="_blank"
                        size="sm"
                      >
                        Открыть прикрепленный чек
                      </Anchor>
                    ) : (
                      <FileInput
                        placeholder="Прикрепить чек (PDF, JPG, PNG)"
                        size="xs"
                        accept="application/pdf,image/png,image/jpeg"
                        onChange={(file) => handleUploadReceipt(payment.id, file)}
                      />
                    )}
                  </Card>
                );
              })}
            </SimpleGrid>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="documents">
          {contracts.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", border: "1px dashed #ccc", borderRadius: "8px" }}>
              <Text c="dimmed">Документов пока нет</Text>
            </div>
          ) : (
            <Stack gap="md">
              {contracts.map((contract) => (
                <Card key={contract.id} withBorder radius="md" padding="md">
                  <Group justify="space-between">
                    <div>
                      <Text fw={600}>Договор аренды №{contract.id}</Text>
                      <Text size="sm" c="dimmed">
                        Объект ID: {contract.property_id}
                      </Text>
                    </div>
                    {contract.document_url ? (
                      <Anchor
                        href={`${BACKEND_URL}${contract.document_url}`}
                        target="_blank"
                        size="sm"
                      >
                        Скачать документ договора
                      </Anchor>
                    ) : (
                      <FileInput
                        placeholder="Загрузить скан договора (PDF)"
                        size="xs"
                        accept="application/pdf,image/png,image/jpeg"
                        onChange={(file) => handleUploadContractDoc(contract.id, file)}
                      />
                    )}
                  </Group>
                </Card>
              ))}
            </Stack>
          )}
        </Tabs.Panel>
      </Tabs>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Добавить объект">
        <TextInput
          label="Название"
          placeholder="Например: Уютная студия"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          mb="sm"
          required
        />
        <TextInput
          label="Адрес"
          placeholder="ул. Ленина, д. 1"
          value={address}
          onChange={(e) => setAddress(e.currentTarget.value)}
          mb="sm"
          required
        />
        <TextInput
          label="Описание"
          placeholder="Рядом с метро..."
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          mb="sm"
        />
        <NumberInput label="Цена (руб/мес)" value={price} onChange={setPrice} min={1} mb="sm" required />
        <NumberInput label="Комнат" value={rooms} onChange={setRooms} min={1} mb="sm" required />
        <NumberInput label="Площадь (м²)" value={area} onChange={setArea} min={1} mb="sm" required />
        <FileInput
          label="Фотографии"
          placeholder="Выберите фото"
          multiple
          accept="image/png,image/jpeg"
          value={files}
          onChange={(newFiles) => setFiles(newFiles || [])}
          mb="sm"
        />
        <Button onClick={handleCreateProperty} fullWidth mt="md">
          Сохранить
        </Button>
      </Modal>

      <Modal opened={paymentModalOpened} onClose={() => setPaymentModalOpened(false)} title="Выставить счет">
        <Select
          label="Договор"
          placeholder="Выберите договор"
          data={contracts.map((c) => ({
            value: String(c.id),
            label: `Договор №${c.id} (Объект ID: ${c.property_id})`,
          }))}
          value={selectedContractId}
          onChange={setSelectedContractId}
          mb="sm"
          required
        />
        <NumberInput
          label="Сумма (руб)"
          value={paymentAmount}
          onChange={setPaymentAmount}
          min={1}
          mb="sm"
          required
        />
        <TextInput
          label="Назначение платежа"
          placeholder="Например: Аренда за декабрь"
          value={paymentDescription}
          onChange={(e) => setPaymentDescription(e.currentTarget.value)}
          mb="md"
        />
        <Button onClick={handleCreatePayment} fullWidth>
          Создать счет
        </Button>
      </Modal>
    </Container>
  );
}
