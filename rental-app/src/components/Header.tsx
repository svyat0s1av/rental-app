import { Group, Title, Button, Avatar, Container } from "@mantine/core";
import { Link } from "react-router-dom";

export function Header() {
  const isLoggedIn = false;

  return (
    <Container size="lg" h="100%">
      <Group justify="space-between" h="100%">
        <Link to="/" style={{ textDecoration: "none" }}>
          <Title order={3}>Аренда жилья</Title>
        </Link>

        {isLoggedIn ? (
          <Avatar component={Link} to="/profile" radius="xl">
            А
          </Avatar>
        ) : (
          <Button component={Link} to="/login" variant="light">
            Войти
          </Button>
        )}
      </Group>
    </Container>
  );
}