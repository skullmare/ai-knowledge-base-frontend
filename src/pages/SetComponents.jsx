import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '@ui/Button/Button';
import Input from '@ui/Input/Input';
import Modal from '@layout/Modal/Modal';
import Layout from '@layout/Layout/Layout';
import Navbar from '@layout/Navbar/Navbar';
import Header from '@layout/Header/Header';

const SECTIONS = [
  { id: 'buttons', label: 'Кнопки' },
  { id: 'inputs', label: 'Поля ввода' },
  { id: 'modals', label: 'Модальные окна' },
];

const NAV_LINKS = [
  { to: '/set-components', label: 'Компоненты' },
];

export default function SetComponents() {
  const { pathname } = useLocation();
  const [activeId, setActiveId] = useState('buttons');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionName, setSectionName] = useState('');

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
          onLogout={() => {}}
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