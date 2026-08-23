export { NAV_LINKS } from '@/constants/navLinks'

/** Вкладки настроек. Каждая доступна только при наличии своего права. */
export const SETTINGS_SECTIONS = [
    {
        id: 'ai',
        label: 'RouterAI',
        permission: 'system_settings.ai_provider',
        title: 'Подключение RouterAI',
        description: 'Ключ доступа и адрес API. Модель эмбеддингов зафиксирована и не настраивается.',
    },
    {
        id: 'google_drive',
        label: 'Google Drive',
        permission: 'system_settings.google_drive',
        title: 'Подключение Google Drive',
        description: 'OAuth-приложение Google и аккаунт, диск которого доступен базе знаний.',
    },
    {
        id: 'agent',
        label: 'Агент',
        permission: 'system_settings.agent',
        title: 'Модель и промпты агента',
        description: 'Модель для ответов пользователям и инструкции, по которым работает агент.',
    },
]

// Поля, которые редактируются многострочным текстом
export const TEXTAREA_KEYS = new Set([
    'agent_system_prompt',
    'agent_empty_context_prompt',
    'agent_link_rules_prompt',
    'agent_rewrite_prompt',
])

export const NUMBER_KEYS = new Set([
    'agent_search_limit',
    'logs_ttl_days',
])

// Порядок полей внутри вкладок
export const SECTION_FIELDS = {
    ai: ['ai_api_key', 'ai_base_url'],
    google_drive: ['google_drive_client_id', 'google_drive_client_secret', 'google_drive_redirect_uri'],
    agent: [
        'ai_chat_model',
        'agent_search_limit',
        'agent_system_prompt',
        'agent_empty_context_prompt',
        'agent_link_rules_prompt',
        'agent_rewrite_prompt',
    ],
}
