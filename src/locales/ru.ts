export default {
    registration: {
        title: 'Регистрация',
        form: {
            header: 'Регистрация',
            fields: {
                login: {
                    label: 'логин',
                },
                nickname: {
                    label: 'никнейм',
                },
                email: {
                    label: 'email',
                },
                password: {
                    label: 'пароль',
                },
                password_confirmation: {
                    label: 'подтверждение пароля',
                },
                invite_code: {
                    code_required: 'Требуется код приглашения',
                    before_admin: 'Получите его у пользователя сайта или свяжитесь с ',
                    admin: 'администратором',
                    after_admin: '.',
                    label: 'код приглашения'
                },
            },
            button: {
                label: 'зарегистрироваться',
            },
            errors: {
                login_required: 'Необходимо указать логин',
                login_too_long: 'Слишком длинный логин',
                login_exists: 'Логин уже существует',
                nickname_required: 'Необходимо указать никнейм',
                nickname_too_long: 'Слишком длинный никнейм',
                nickname_exists: 'Никнейм уже существует',
                email_required: 'Необходимо указать email',
                email_invalid: 'Некорректный email',
                email_exists: 'Email уже существует',
                email_too_long: 'Слишком длинный email',
                password_required: 'Необходимо указать пароль',
                password_confirmation_required: 'Необходимо подтвердить пароль',
                passwords_mismatch: 'Пароли не совпадают',
                invite_code_required: 'Необходимо указать код приглашения',
            },
            exceptions: {
                email_exists: 'Email уже существует',
                nickname_exists: 'Никнейм уже существует',
                login_exists: 'Логин уже существует',
                invalid_invite_code: 'Неверный код приглашения',
                unknown: 'Неизвестная ошибка. Попробуйте позже или свяжитесь с администратором',
            },
        },
    },
    login: {
        title: 'Вход',
        form: {
            header: 'Добро пожаловать',
            fields: {
                login: {
                    label: 'логин',
                },
                password: {
                    label: 'пароль',
                },
            },
            button: {
                label: 'войти',
            },
            errors: {
                login_required: 'Необходимо указать логин',
                password_required: 'Необходимо указать пароль',
            },
            exceptions: {
                invalid_credentials: 'Неверный логин или пароль',
            },
        },
    },
    additionalInfo: {
        title: 'Регистрация',
        form: {
            description: {
                line1: 'Вы зарегистрированы.',
                line2: 'Пожалуйста, заполните следующую информацию для завершения профиля.',
            },
            fields: {
                sex: {
                    label: 'пол',
                    male: 'мужской',
                    female: 'женский',
                    unknown: 'не указан',
                },
                timezone: {
                    label: 'часовой пояс',
                },
                language: {
                    label: 'предпочитаемый язык',
                    en: 'English',
                    kk: 'Qazaq',
                    kk_cyrillic: 'Қазақ',
                    ru: 'Русский',
                },
                nsfw: {
                    label: 'NSFW контент',
                    show: 'показывать',
                    hide: 'не показывать',
                    warn: 'размывать перед показом',
                },
                birthday: {
                    label: 'дата рождения',
                },
            },
            buttons: {
                send: {
                    label: 'отправить',
                },
                skip: {
                    label: 'пропустить',
                },
            },
        },
    },
    diaryInfo: {
        title: 'Регистрация',
        form: {
            description: {
                line1: 'Теперь заполните информацию о дневнике и настройки по умолчанию.',
            },
            fields: {
                name: {
                    label: 'название дневника',
                },
                description: {
                    label: 'подзаголовок',
                },
                read_privacy: {
                    label: 'кто может читать',
                    registered: 'зарегистрированные пользователи',
                    everyone: 'все',
                    friends: 'друзья',
                    nobody: 'только я',
                },
                comment_privacy: {
                    label: 'кто может комментировать',
                    registered: 'зарегистрированные пользователи',
                    everyone: 'все',
                    friends: 'друзья',
                    nobody: 'только я',
                },
            },
            buttons: {
                send: {
                    label: 'отправить',
                },
                skip: {
                    label: 'пропустить',
                },
            },
        }
    },
    reactions: {
        reaction: {
            anonymous: 'анонимно: '
        },
        add_reaction: {
            search: 'Поиск реакций...',
            no_reactions: 'Реакции не найдены',
            recent: 'Недавние реакции',
            basic: 'Основные реакции',
        },
    },
    post: {
        form: {
            title: 'Новый пост:',
            fields: {
                title: {
                    label: 'Заголовок:',
                },
                textarea: {
                    buttons: {
                        bold: {
                            tooltip: 'Жирный текст',
                        },
                        italic: {
                            tooltip: 'Курсив',
                        },
                        underline: {
                            tooltip: 'Подчёркнутый текст',
                        },
                        strikethrough: {
                            tooltip: 'Зачёркнутый текст',
                        },
                        expandable: {
                            tooltip: 'Добавить раздел \'Читать далее...\'',
                        },
                        link: {
                            tooltip: 'Вставить ссылку',
                        },
                        image: {
                            tooltip: 'Вставить изображение',
                        },
                        slider: {
                            tooltip: 'Вставить слайдер',
                        },
                        left: {
                            tooltip: 'Выровнять по левому краю',
                        },
                        center: {
                            tooltip: 'Выровнять по центру',
                        },
                        right: {
                            tooltip: 'Выровнять по правому краю',
                        },
                        justify: {
                            tooltip: 'Выровнять по ширине',
                        },
                        quote: {
                            tooltip: 'Цитата',
                        },
                        code: {
                            tooltip: 'Код',
                        },
                        spoiler: {
                            tooltip: 'Спойлер',
                        },
                        nsfw: {
                            tooltip: 'NSFW контент',
                        },
                        bigger: {
                            tooltip: 'Увеличить размер текста',
                        },
                        smaller: {
                            tooltip: 'Уменьшить размер текста',
                        },
                        gothic: {
                            tooltip: 'Готический шрифт',
                        },
                        css: {
                            tooltip: 'Добавить пользовательские CSS классы',
                        },
                    },
                },
                tags: {
                    label: 'теги:',
                },
                classes: {
                    label: 'html классы:',
                },
                read: {
                    label: 'чтение:',
                },
                comment: {
                    label: 'комментирование:',
                },
                react: {
                    label: 'реакции:',
                },
                advanced: {
                    label: 'дополнительные настройки',
                },
            },
            button: {
                send: 'опубликовать'
            }
        },
    },
    groups: {
        basic: {
            everyone: {
                label: 'все',
            },
            registered: {
                label: 'зарегистрированные пользователи',
            },
            friends: {
                label: 'друзья',
            },
            nobody: {
                label: 'только я',
            },
        }
    }
}
