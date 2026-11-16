import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Paper, PasswordInput, TextInput, Title, Anchor, Select } from '@mantine/core';
import classes from './LoginPage.module.css';
import api from '../api/client';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string | null>('renter');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', {
        email,
        full_name: fullName,
        password,
        role
      });
      alert('Регистрация успешна! Теперь войдите в систему.');
      navigate('/login');
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Ошибка при регистрации. Проверьте введенные данные.');
      }
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form}>
        <Title order={2} className={classes.title}>
          Регистрация
        </Title>

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <TextInput 
          label="Электронная почта" 
          placeholder="hello@gmail.com" 
          size="md" 
          radius="md" 
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />
        <TextInput 
          label="Ваше имя" 
          placeholder="Иван Иванов" 
          mt="md" 
          size="md" 
          radius="md" 
          value={fullName}
          onChange={(e) => setFullName(e.currentTarget.value)}
          required
        />
        <PasswordInput 
          label="Пароль" 
          placeholder="Минимум 6 символов" 
          mt="md" 
          size="md" 
          radius="md" 
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          required
        />
        <Select
          label="Кто вы?"
          placeholder="Выберите роль"
          data={[
            { value: 'renter', label: 'Арендатор (ищу жильё)' },
            { value: 'owner', label: 'Арендодатель (сдаю жильё)' },
          ]}
          value={role}
          onChange={setRole}
          mt="md"
          size="md"
          radius="md"
        />
        
        <Button onClick={handleRegister} fullWidth mt="xl" size="md" radius="md">
          Зарегистрироваться
        </Button>

        <Anchor component={Link} to="/login" fw={500} mt="md" style={{ display: 'block', textAlign: 'center' }}>
          Уже есть аккаунт? Войти
        </Anchor>
      </Paper>
    </div>
  );
}