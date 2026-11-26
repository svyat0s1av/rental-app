import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Checkbox, Paper, PasswordInput, TextInput, Title, Anchor } from '@mantine/core';
import classes from '../../../shared/ui/AuthPage.module.css';
import api from '../../../shared/api';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      localStorage.setItem('token', response.data.access_token);
      navigate('/profile');
    } catch (err: any) {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form}>
        <Title order={2} className={classes.title}>
          Добро пожаловать!
        </Title>

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <TextInput 
          label="Электронная почта" 
          placeholder="hello@gmail.com" 
          size="md" 
          radius="md" 
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <PasswordInput 
          label="Пароль" 
          placeholder="Ваш пароль" 
          mt="md" 
          size="md" 
          radius="md" 
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <Checkbox label="Запомнить меня" mt="xl" size="md" />
        <Button onClick={handleLogin} fullWidth mt="xl" size="md" radius="md">
          Войти
        </Button>

        <Anchor component={Link} to="/register" fw={500} mt="md" style={{ display: 'block', textAlign: 'center' }}>
          Регистрация
        </Anchor>
      </Paper>
    </div>
  );
}