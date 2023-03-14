import { Action } from "src/interfaces/telegraf-context.interfaces"

export const keyboardsInit = async (confirm: boolean, user?: string) => {
    if (confirm) {
        return {
            message: `Здраствуйте ${user}\nВоспользуйтесь нашими софтами\nдля генирации описанния карточки товара\nи отслеживанием позиции товара WB`,
            keyboard: {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🤖 AI - Копирайтер", callback_data: 'copywriter' }],
                        [{ text: "📟  Другие Сервисы", callback_data: 'services' }],
                        [{ text: "💬 Наши каналы и чаты", callback_data: 'chats_and_chanels' }],
                        [{ text: "🤝 Поддержка", callback_data: 'support' }]
                    ]
                },
            }
        }
    }
    return {
        message: 'Чтобы начать пользоваться ботом, зарегистрируйтесь.\nВыберите необходимый запрос',
        keyboard: {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📑 Регистрация", callback_data: 'register' }],
                    [{ text: "🤝 Поддержка", callback_data: 'support' }],
                    [{ text: "💬 Наши каналы и чаты", callback_data: 'chats_and_chanels' }]
                ]
            }
        }
    }
}

export const keyboardsAction = async (action: string) => {
    switch (action) {
        case 'AI_COPYWRITER': {
            return {
                message: 'Хотите другое описание?',
                keyboard: {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "Генерировать еще 🤖", callback_data:'copywriter' }, { text: "Оцените работу AI ⭐", callback_data:'review' }],
                            [{ text: "🔙 Вернутся в меню", callback_data: 'menu' }]
                        ]
                    }
                }
            }
        }
        case "SUPPORT": {
            return {
                message: 'Хотите другое описание?',
                keyboard: {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "Да", callback_data:'copywriter' }],
                            [{ text: "Нет", callback_data: 'menu' }]
                        ]
                    }
                }
            }
        }
    }
}

