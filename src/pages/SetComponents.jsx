import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '@ui/Button/Button';
import Input from '@ui/Input/Input';
import Modal from '@layout/Modal/Modal';
import Layout from '@layout/Layout/Layout';
import Table from '@layout/Table/Table';
import Navbar from '@layout/Navbar/Navbar';
import Header from '@layout/Header/Header';
import Dropdown from '@ui/Dropdown/Dropdown';

const SECTIONS = [
  { id: 'buttons', label: 'Кнопки' },
  { id: 'inputs', label: 'Поля ввода' },
  { id: 'modals', label: 'Модальные окна' },
  { id: 'dropdowns', label: 'Выпадающие списки' },
];

const NAV_LINKS = [
  { to: '/set-components', label: 'Компоненты' },
];

const ROLES = [
  { value: 'all', label: 'Все роли' },
  { value: 'operator-admin', label: 'Админ оператора' },
  { value: 'project-manager', label: 'Менеджер проекта' },
  { value: 'project-lead', label: 'Руководитель проекта' },
  { value: 'developer-rep', label: 'Представитель застройщика' },
  { value: 'partner-admin', label: 'Админ партнёра' },
  { value: 'partner-manager', label: 'Менеджер партнёра' },
];

const columns = [
  { key: 'date', label: 'Дата, время' },
  { key: 'name', label: 'Имя и фамилия' },
  { key: 'object', label: 'Изменённый объект' },
  { key: 'action', label: 'Действие' },
  {
    key: 'status',
    label: 'Результат',
    render: (value) => (
      <Button size="interface" variant="primary">Сохранить</Button>
    )
  },
]

const LOGS = [
  { _id: '1', date: '12.04.2026 11:30:43', name: 'Алексей Морозов', object: 'Тема «Инструкция для новых пользователей»', action: 'Добавлены роли', status: 'success' },
  { _id: '2', date: '06.02.2026 12:58:07', name: 'Екатерина Соколова', object: 'Статус пользователя', action: 'Активирован пользователь', status: 'error' },
  { _id: '3', date: '23.05.2026 23:11:52', name: 'Дмитрий Лебедев', object: 'Роль «Менеджер»', action: 'Изменены доступы', status: 'success' },
  { _id: '4', date: '11.05.2026 10:56:31', name: 'Мария Кузнецова', object: 'Роль «Оператор»', action: 'Изменено описание', status: 'success' },
  { _id: '5', date: '10.05.2026 16:27:37', name: 'Илья Орлов', object: 'Тема «Статусы и уведомления»', action: 'Отредактирована статья, добавлены файлы', status: 'success' },
  { _id: '6', date: '12.12.2025 18:34:09', name: 'Анна Волкова', object: 'Статус пользователя', action: 'Активирован пользователь', status: 'success' },
  { _id: '7', date: '30.05.2025 03:16:02', name: 'Сергей Никитин', object: 'Статус пользователя', action: 'Активирован пользователь', status: 'error' },
  { _id: '8', date: '14.03.2026 07:14:23', name: 'Анна Волкова', object: 'Статус пользователя', action: 'Активирован пользователь', status: 'error' },
  { _id: '9', date: '12.12.2025 18:34:09', name: 'Сергей Никитин', object: 'Статус пользователя', action: 'Активирован пользователь', status: 'success' },
  { _id: '10', date: '14.03.2026 07:14:23', name: 'Ольга Петрова', object: 'Статус пользователя', action: 'Заблокирован пользователь', status: 'success' },
  { _id: '1', date: '12.04.2026 11:30:43', name: 'Алексей Морозов', object: 'Тема «Инструкция для новых пользователей»', action: 'Добавлены роли', status: 'success' },
  { _id: '2', date: '06.02.2026 12:58:07', name: 'Екатерина Соколова', object: 'Статус пользователя', action: 'Активирован пользователь', status: 'error' },
  { _id: '3', date: '23.05.2026 23:11:52', name: 'Дмитрий Лебедев', object: 'Роль «Менеджер»', action: 'Изменены доступы', status: 'success' },
  { _id: '4', date: '11.05.2026 10:56:31', name: 'Мария Кузнецова', object: 'Роль «Оператор»', action: 'Изменено описание', status: 'success' },
  { _id: '5', date: '10.05.2026 16:27:37', name: 'Илья Орлов', object: 'Тема «Статусы и уведомления»', action: 'Отредактирована статья, добавлены файлы', status: 'success' },
  { _id: '6', date: '12.12.2025 18:34:09', name: 'Анна Волкова', object: 'Статус пользователя', action: 'Активирован пользователь', status: 'success' },
  { _id: '7', date: '30.05.2025 03:16:02', name: 'Сергей Никитин', object: 'Статус пользователя', action: 'Активирован пользователь', status: 'error' },
  { _id: '8', date: '14.03.2026 07:14:23', name: 'Анна Волкова', object: 'Статус пользователя', action: 'Активирован пользователь', status: 'error' },
  { _id: '9', date: '12.12.2025 18:34:09', name: 'Сергей Никитин', object: 'Статус пользователя', action: 'Активирован пользователь', status: 'success' },
  { _id: '10', date: '14.03.2026 07:14:23', name: 'Ольга Петрова', object: 'Статус пользователя', action: 'Заблокирован пользователь', status: 'success' },
  { _id: '1', date: '12.04.2026 11:30:43', name: 'Алексей Морозов', object: 'Тема «Инструкция для новых пользователей»', action: 'Добавлены роли', status: 'success' },
  { _id: '2', date: '06.02.2026 12:58:07', name: 'Екатерина Соколова', object: 'Статус пользователя', action: 'Активирован пользователь', status: 'error' },
  { _id: '3', date: '23.05.2026 23:11:52', name: 'Дмитрий Лебедев', object: 'Роль «Менеджер»', action: 'Изменены доступы', status: 'success' },
  { _id: '4', date: '11.05.2026 10:56:31', name: 'Мария Кузнецова', object: 'Роль «Оператор»', action: 'Изменено описание', status: 'success' },
  { _id: '5', date: '10.05.2026 16:27:37', name: 'Илья Орлов', object: 'Тема «Статусы и уведомления»', action: 'Отредактирована статья, добавлены файлы', status: 'success' },
  { _id: '6', date: '12.12.2025 18:34:09', name: 'Анна Волкова', object: 'Статус пользователя', action: 'Активирован пользователь', status: 'success' },
  { _id: '7', date: '30.05.2025 03:16:02', name: 'Сергей Никитин', object: 'Статус пользователя', action: 'Активирован пользователь', status: 'error' },
  { _id: '8', date: '14.03.2026 07:14:23', name: 'Анна Волкова', object: 'Статус пользователя', action: 'Активирован пользователь', status: 'error' },
  { _id: '9', date: '12.12.2025 18:34:09', name: 'Сергей Никитин', object: 'Статус пользователя', action: 'Активирован пользователь', status: 'success' },
  { _id: '10', date: '14.03.2026 07:14:23', name: 'Ольга Петрова', object: 'Статус пользователя', action: 'Заблокирован пользователь', status: 'success' },
]

export default function SetComponents() {
  const { pathname } = useLocation();
  const [activeId, setActiveId] = useState('buttons');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionName, setSectionName] = useState('');
  const [role, setRole] = useState('all');
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const closeModal = () => { setIsModalOpen(false); setSectionName(''); };

  return (
    <Layout
      navbar={
        <Navbar
          sections={SECTIONS}
          activeSection={activeId}
          onSelect={setActiveId}
        />
      }
      header={
        <Header
          navLinks={NAV_LINKS}
          activeLink={pathname}
          onLogout={() => { }}
          userLogin="Developer"
          userRole="Разработчик"
        />
      }
    >
      <div className="set-components">

        <h1>Кнопки</h1>
        <div className="buttons-list">
          <Button size="login" variant="primary">Войти</Button>
          <Button size="interface" variant="primary">Сохранить</Button>
          <Button size="logout">Выйти</Button>
          <Button size="modal" variant="secondary">Отмена</Button>
          <Button size="modal" variant="primary" disabled>Подтвердить</Button>
          <Button size="modal" variant="secondary" disabled>Отмена</Button>
        </div>

        <h1>Поля ввода</h1>
        <div className="inputs-list">
          <Input variant="default" size="medium" placeholder="username" label="Login" required defaultValue="johnblack" />
          <Input variant="default" size="large" placeholder="Иванов Иван Иванович" showClearButton label="ФИО" />
          <Input variant="search" size="medium" showSearchButton placeholder="Поиск" label="Поиск" />
          <Input label="Пароль" required variant="default" size="large" showClearButton showPasswordToggle type="password" />
          <Input label="Email" error errorText="Email обязателен для заполнения" />
        </div>

        <h1>Модальные окна</h1>
        <div className="buttons-list">
          <Button size="interface" variant="primary" onClick={() => setIsModalOpen(true)}>
            Открыть модалку
          </Button>
        </div>

        <h1>Выпадающие списки</h1>
        <div className="inputs-list">
          <Dropdown options={ROLES} value={role} onChange={setRole} />
          <Dropdown options={ROLES} value={null} placeholder="Выберите роль" onChange={setRole} />
          <Dropdown options={[]} placeholder="Нет вариантов" />
        </div>
        <h1>Таблица</h1>
        <Table
          columns={columns}
          data={LOGS}
          page={page}
          limit={limit}
          total={LOGS.length}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
        {isModalOpen && (
          <Modal
            title="Создание раздела"
            onClose={closeModal}
            onConfirm={() => { console.log('Создать:', sectionName); closeModal(); }}
            confirmLabel="Создать"
            confirmDisabled={!sectionName.trim()}
          >
            <Input
              variant="default"
              size="large"
              placeholder="Укажите название раздела"
              showClearButton
              label="Название"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
            />
          </Modal>
        )}

      </div>
    </Layout>
  );
}