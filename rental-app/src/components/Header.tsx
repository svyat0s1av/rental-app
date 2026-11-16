import { useEffect, useState } from "react";
import { Group, Title, Button, Avatar, Container } from "@mantine/core";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <Container size="lg" h="100%">
      <Group justify="space-between" h="100%">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Title order={3}>Аренда жилья</Title>
        </Link>

        {isLoggedIn ? (
          <Group gap="sm">
            <Avatar component={Link} to="/profile" radius="xl" color="blue">
              ЛК
            </Avatar>
            <Button variant="subtle" color="red" size="xs" onClick={handleLogout}>
              Выйти
            </Button>
          </Group>
        ) : (
          <Button component={Link} to="/login" variant="light">
            Войти
          </Button>
        )}
      </Group>
    </Container>
  );
}
