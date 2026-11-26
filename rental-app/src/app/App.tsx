import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@mantine/core";
import { Header } from "../widgets/header";
import { HomePage } from "../pages/home";
import { LoginPage } from "../pages/login";
import { ProfilePage } from "../pages/profile";
import { PropertyDetailPage } from "../pages/property-detail";
import { RegisterPage } from "../pages/register";

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
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </BrowserRouter>
  );
}
