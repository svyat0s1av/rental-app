import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@mantine/core";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { PropertyDetailPage } from "./pages/PropertyDetailPage";
export function App() {
  return (
    <BrowserRouter>
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header>
          <Header />
        </AppShell.Header>

        <AppShell.Main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </BrowserRouter>
  );
}