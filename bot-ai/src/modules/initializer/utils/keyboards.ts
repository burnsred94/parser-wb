import { Action, StatusUserBot } from "src/interfaces/telegraf-context.interfaces"

export const keyboardsInit = async (confirm: StatusUserBot, user?: string) => {
    if (confirm === StatusUserBot['REGISTER_BOT_SITE']) {
        return {
            message: `Здраствуйте ${user}\nВоспользуйтесь нашими софтами\nдля генирации описанния карточки товара\nи отслеживанием позиции товара WB`,
            keyboard: {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🤖 AI - Копирайтер", callback_data: 'copywriter' }],
                        [{ text: "📟 Другие Сервисы", callback_data: 'services' }],
                        [{ text: "💬 Наши каналы и чаты", callback_data: 'chats_and_chanels' }],
                        [{ text: "🤝 Поддержка", callback_data: 'support' }]
                    ]
                },
            }
        }
    } else {
        return {
            message: 'Чтобы начать пользоваться ботом, зарегистрируйтесь.\nВыберите необходимый запрос',
            keyboard: {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📑 Регистрация", callback_data: 'register' }, { text: "🔑 Авторизация", callback_data: 'login' }],
                        [{ text: "🤝 Поддержка", callback_data: 'support' }],
                        [{ text: "💬 Наши каналы и чаты", callback_data: 'chats_and_chanels' }]
                    ]
                }
            }
        }

    }
}

export const keyboardsAction = async (action: Action) => {
    switch (action) {
        case Action.AI_COPYWRITER: {
            return {
                message: 'Хотите другое описание?',
                keyboard: {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "Генерировать еще 🤖", callback_data: 'copywriter' }, { text: "Оцените работу AI ⭐", callback_data: 'review' }],
                            [{ text: "🔙 Вернуться в меню", callback_data: 'menu' }]
                        ]
                    }
                }
            }
        }
    }
}

