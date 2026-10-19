import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  TextInput,
  Title
} from '@mantine/core';
import classes from './LoginPage.module.css';

export function LoginPage() {
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form}>
        <Title order={2} className={classes.title}>
          Добро пожаловать!
        </Title>

        <TextInput label="Электронная почта" placeholder="hello@gmail.com" size="md" radius="md" />
        <PasswordInput label="Пароль" placeholder="Ваш пароль" mt="md" size="md" radius="md" />
        <Checkbox label="Запомнить меня" mt="xl" size="md" />
        <Button fullWidth mt="xl" size="md" radius="md">
          Войти
        </Button>

          <Anchor href="#" fw={500} onClick={(event) => event.preventDefault()}>
            Регистрация
          </Anchor>
      </Paper>
    </div>
  );
}