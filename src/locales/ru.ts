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
                send: 'опубликовать',
                cancel: 'отмена',
                repost: 'репост'
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
    },
    settings: {
        title: 'Настройки',
        search: {
            placeholder: 'Поиск настроек...',
        },
        notYetImplemented: 'Ещё не реализовано',
        categories: {
            user: {
                title: 'Пользователь',
                triggers: {
                    account: 'аккаунт',
                    profile: 'профиль',
                    userSettings: 'настройки пользователя',
                },
                items: {
                    nickname: {
                        title: 'Никнейм',
                        triggers: {
                            username: 'имя пользователя',
                            changeUsername: 'изменить имя пользователя',
                            changeNickname: 'изменить никнейм',
                        },
                    },
                    signature: {
                        title: 'Подпись',
                        triggers: {
                            bio: 'био',
                            status: 'статус',
                        },
                    },
                    timezone: {
                        title: 'Часовой пояс',
                        triggers: {
                            time: 'время',
                            zone: 'зона',
                            clock: 'часы',
                        },
                    },
                    language: {
                        title: 'Язык',
                        triggers: {
                            language: 'язык',
                            locale: 'локаль',
                            changeLanguage: 'сменить язык',
                        },
                    },
                    ignoreList: {
                        title: 'Список игнорируемых',
                        triggers: {
                            ignore: 'игнорировать',
                            block: 'заблокировать',
                            blockedUsers: 'заблокированные пользователи',
                        },
                    },
                    hiddenUsers: {
                        title: 'Скрытые пользователи',
                        triggers: {
                            hide: 'скрыть',
                            hidden: 'скрытые',
                            muteUsers: 'заглушить пользователей',
                        },
                    },
                    inviteCode: {
                        title: 'Инвайт-код',
                        triggers: {
                            invite: 'инвайт',
                            code: 'код',
                            invitation: 'приглашение',
                        },
                    },
                },
            },
            diary: {
                title: 'Дневник',
                triggers: {
                    blog: 'блог',
                    journal: 'журнал',
                },
                items: {
                    diaryTitle: {
                        title: 'Название дневника',
                        triggers: {
                            blogName: 'название блога',
                            diaryName: 'название дневника',
                        },
                    },
                    preface: {
                        title: 'Предисловие',
                        triggers: {
                            intro: 'введение',
                            description: 'описание',
                        },
                    },
                    defaultGroups: {
                        title: 'Группы по умолчанию',
                        triggers: {
                            default: 'по умолчанию',
                            autoAssign: 'автоназначение',
                        },
                    },
                    manageGroups: {
                        title: 'Управление группами',
                        triggers: {
                            manage: 'управление',
                            groups: 'группы',
                            memberGroups: 'группы участников',
                        },
                    },
                    hiddenPosts: {
                        title: 'Скрытые записи',
                        triggers: {
                            hidden: 'скрытые',
                            private: 'приватные',
                            visibility: 'видимость',
                        },
                    },
                },
            },
            avatars: {
                title: 'Аватары',
                triggers: {
                    avatar: 'аватар',
                    profilePicture: 'фото профиля',
                    photo: 'фото',
                },
                items: {
                    avatars: {
                        title: 'Аватары',
                        triggers: {
                            manage: 'управление',
                            upload: 'загрузить',
                        },
                    },
                },
            },
            reactions: {
                title: 'Реакции',
                triggers: {
                    emoji: 'эмодзи',
                    react: 'реакция',
                },
                items: {
                    createReactionPack: {
                        title: 'Создать набор реакций',
                        triggers: {
                            create: 'создать',
                            newPack: 'новый набор',
                        },
                    },
                    myReactionPacks: {
                        title: 'Мои наборы реакций',
                        triggers: {
                            packs: 'наборы',
                            manage: 'управление',
                        },
                    },
                },
            },
            notifications: {
                title: 'Уведомления',
                triggers: {
                    alerts: 'оповещения',
                    notify: 'уведомить',
                },
                items: {
                    onsiteNotifications: {
                        title: 'Уведомления на сайте',
                        triggers: {
                            onsite: 'на сайте',
                            web: 'веб',
                        },
                    },
                    emailNotifications: {
                        title: 'Уведомления по почте',
                        triggers: {
                            email: 'почта',
                            mail: 'письмо',
                        },
                    },
                },
            },
            security: {
                title: 'Безопасность',
                triggers: {
                    safety: 'безопасность',
                    protection: 'защита',
                },
                items: {
                    password: {
                        title: 'Пароль',
                        triggers: {
                            changePassword: 'изменить пароль',
                            resetPassword: 'сбросить пароль',
                        },
                    },
                    emailAddress: {
                        title: 'Адрес электронной почты',
                        triggers: {
                            changeEmail: 'изменить почту',
                            email: 'почта',
                        },
                    },
                    activeSessions: {
                        title: 'Активные сессии',
                        triggers: {
                            sessions: 'сессии',
                            devices: 'устройства',
                            loggedIn: 'вошли',
                        },
                    },
                    twoFactorAuth: {
                        title: 'Двухфакторная аутентификация',
                        triggers: {
                            twoFactor: 'двухфакторная',
                            totp: 'totp',
                            authenticator: 'аутентификатор',
                        },
                    },
                },
            },
            preferences: {
                title: 'Предпочтения',
                triggers: {
                    customize: 'настроить',
                    options: 'параметры',
                },
                items: {
                    appearance: {
                        title: 'Внешний вид',
                        triggers: {
                            theme: 'тема',
                            darkMode: 'тёмная тема',
                            look: 'оформление',
                        },
                    },
                    accessibility: {
                        title: 'Доступность',
                        triggers: {
                            a11y: 'доступность',
                            screenReader: 'экранный диктор',
                        },
                    },
                    layout: {
                        title: 'Макет',
                        triggers: {
                            columns: 'колонки',
                            arrangement: 'расположение',
                        },
                    },
                },
            },
        },
    },
    nicknameSettings: {
        placeholder: 'Введите никнейм',
        save: 'Сохранить',
        cancel: 'Отмена',
        saveSuccess: 'Никнейм успешно обновлён',
        saveError: 'Не удалось обновить никнейм',
        loadError: 'Не удалось загрузить никнейм',
        errors: {
            required: 'Необходимо указать никнейм',
            tooLong: 'Слишком длинный никнейм',
            alreadyExists: 'Никнейм уже существует',
        },
    },
    signatureSettings: {
        placeholder: 'Введите подпись',
        save: 'Сохранить',
        cancel: 'Отмена',
        saveSuccess: 'Подпись успешно обновлена',
        saveError: 'Не удалось обновить подпись',
        loadError: 'Не удалось загрузить подпись',
        errors: {
            tooLong: 'Подпись слишком длинная (максимум 200 символов)',
        },
    },
    styles: {
        title: 'Стили дневника',
        addNew: 'Добавить новый стиль',
        addNewStyle: 'Добавить новый стиль',
        save: 'Сохранить изменения',
        cancel: 'Отменить изменения',
        add: 'Добавить',
        name: 'Название',
        styleContent: 'Содержимое CSS стиля',
        enabled: 'Включен',
        previewImage: 'Изображение предпросмотра',
        confirmDelete: 'Вы уверены, что хотите удалить этот стиль?',
        loadError: 'Не удалось загрузить стили',
        updateSuccess: 'Стиль успешно обновлен',
        updateError: 'Не удалось обновить стиль',
        addSuccess: 'Стиль успешно добавлен',
        addError: 'Не удалось добавить стиль',
        deleteSuccess: 'Стиль успешно удален',
        deleteError: 'Не удалось удалить стиль',
        saveSuccess: 'Изменения успешно сохранены',
        saveError: 'Не удалось сохранить изменения',
        changesCancelled: 'Изменения отменены',
        requiredFields: 'Название и содержимое CSS стиля обязательны',
        previewUrlApplied: 'URL изображения предпросмотра успешно применен'
    },
    feed: {
        latest: 'Свежее',
        popular: 'Популярное',
        following: 'Подписки',
        friends: 'Друзья'
    },
    errors: {
        not_found: 'Страница или пост не найдены'
    },
    buttons: {
        go_home: 'На главную',
        go_back: 'Назад'
    }
}
