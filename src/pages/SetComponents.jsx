import React from 'react';
import Button from '@ui/Button/Button';
import Input from '@ui/Input/Input';


const SetComponents = () => {
    return (
        <div className="set-components">
            <h1>Кнопки</h1>

            <div className="buttons-list">
                {/* Кнопка логина - primary */}
                <Button size="login" variant="primary">
                    Войти
                </Button>

                {/* Кнопка интерфейса - primary */}
                <Button size="interface" variant="primary">
                    Сохранить
                </Button>

                {/* Кнопка выхода - специальный размер logout, variant primary */}
                <Button size="logout">
                    Выйти
                </Button>

                {/* Кнопка отмены в модалке - secondary */}
                <Button size="modal" variant="secondary">
                    Отмена
                </Button>

                {/* Disabled primary */}
                <Button size="modal" variant="primary" disabled>
                    Подтвердить
                </Button>

                {/* Disabled secondary */}
                <Button size="modal" variant="secondary" disabled>
                    Отмена
                </Button>
            </div>

            <h1>Поля ввода</h1>
            <div className="inputs-list">
                <Input variant="default" size="medium" placeholder="username" label={"Login"} required defaultValue="johnblack" />

                <Input variant="default" size="large" placeholder="Иванов Иван Иванович" showClearButton label={"ФИО"} />

                <Input variant="search" size="medium" showSearchButton placeholder="Поиск" label="Поиск" />

                <Input
                    label="Пароль"
                    required
                    variant="default"
                    size="large"
                    showClearButton
                    showPasswordToggle
                    type="password"
                />
                <Input
                    label="Email"
                    error={true}
                    errorText="Email обязателен для заполнения"
                />
            </div>
        </div>
    );
};

export default SetComponents;