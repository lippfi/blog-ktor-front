export default {
    search: {
        title: 'Поиск',
        placeholder: 'Искать записи...',
        advanced: {
            label: 'Расширенный поиск',
            tags: {
                label: 'Теги',
                placeholder: 'Введите теги'
            },
            tagPolicy: {
                label: 'Совпадение тегов',
                union: 'любой тег (OR)',
                intersection: 'все теги (AND)'
            },
            from: {
                label: 'Дата от',
                placeholder: 'Выберите начальную дату'
            },
            to: {
                label: 'Дата до',
                placeholder: 'Выберите конечную дату'
            },
            sorting: {
                label: 'Сортировка',
                field: {
                    label: 'Поле',
                    creationTime: 'Дата',
                    title: 'Заголовок'
                },
                order: {
                    label: 'Порядок',
                    asc: 'сначала старые',
                    desc: 'сначала новые'
                }
            }
        },
        button: {
            search: 'Искать',
            clear: 'Очистить'
        },
        noPostsFound: 'Записи не найдены'
    },
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
                    label: 'электронная почта',
                },
                password: {
                    label: 'пароль',
                },
                password_confirmation: {
                    label: 'подтверждение пароля',
                },
                invite_code: {
                    code_required: 'Требуется инвайт-код',
                    before_admin: 'Получите его у участника сайта или напишите ',
                    admin: 'администратору',
                    after_admin: '.',
                    label: 'инвайт-код'
                },
            },
            button: {
                label: 'зарегистрироваться',
            },
            errors: {
                login_required: 'Логин обязателен',
                login_too_long: 'Логин слишком длинный',
                login_exists: 'Логин уже существует',
                nickname_required: 'Никнейм обязателен',
                nickname_too_long: 'Никнейм слишком длинный',
                nickname_exists: 'Никнейм уже существует',
                email_required: 'Электронная почта обязательна',
                email_invalid: 'Некорректная электронная почта',
                email_exists: 'Электронная почта уже существует',
                email_too_long: 'Электронная почта слишком длинная',
                password_required: 'Пароль обязателен',
                password_confirmation_required: 'Требуется подтверждение пароля',
                passwords_mismatch: 'Пароли не совпадают',
                invite_code_required: 'Инвайт-код обязателен',
            },
            exceptions: {
                email_exists: 'Электронная почта уже существует',
                nickname_exists: 'Никнейм уже существует',
                login_exists: 'Логин уже существует',
                invalid_invite_code: 'Неверный инвайт-код',
                unknown: 'Неизвестная ошибка. Попробуйте позже или свяжитесь с администратором',
            },
        },
    },
    email_confirmation: {
        title: "Подтверждение электронной почты",
        form: {
            header: "Подтверждение электронной почты",
            fields: {
                code: {
                    label: "код подтверждения",
                },
                message: {
                    line1: "Код подтверждения был отправлен на вашу электронную почту.",
                    line2: "Пожалуйста, введите код, чтобы подтвердить электронную почту.",
                }
            },
            button: {
                label: "подтвердить",
            }
        }
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
                login_required: 'Логин обязателен',
                password_required: 'Пароль обязателен',
            },
            exceptions: {
                invalid_credentials: 'Неверные учетные данные',
            },
            forgot_password: {
                label: 'забыли пароль',
            }
        },
    },
    reset: {
        title: 'Сброс пароля',
        form: {
            header: 'Сброс пароля',
            fields: {
                identifier: {
                    label: 'электронная почта или логин',
                },
                code: {
                    label: 'код подтверждения',
                },
                password: {
                    label: 'пароль',
                },
                password_confirmation: {
                    label: 'подтверждение пароля',
                },
            },
            description: {
                line1: 'Код подтверждения был отправлен на вашу электронную почту.',
            },
            errors: {
                field_required: 'Поле обязательно',
                password_required: 'Пароль обязателен',
                password_confirmation_required: 'Требуется подтверждение пароля',
                passwords_mismatch: 'Пароли не совпадают',
            },
            button: {
                label: 'дальше',
            },
            button2: {
                label: 'подтвердить',
            },
        },
    },
    additionalInfo: {
        title: 'Регистрация',
        form: {
            description: {
                line1: 'Вы зарегистрированы.',
                line2: 'Пожалуйста, заполните следующую информацию, чтобы завершить профиль.',
            },
            fields: {
                sex: {
                    label: 'пол',
                    male: 'мужской',
                    female: 'женский',
                    unknown: 'неизвестно',
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
                    label: 'Политика NSFW',
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
                    label: 'подтвердить',
                },
                skip: {
                    label: 'пропустить',
                },
            },
            validation: {
                sex: {
                    required: 'Укажите пол',
                    invalid: 'Некорректное значение пола',
                },
                nsfw: {
                    required: 'Укажите политику NSFW',
                    invalid: 'Некорректное значение политики NSFW',
                },
                language: {
                    required: 'Укажите язык',
                    invalid: 'Некорректное значение языка',
                },
                timezone: {
                    required: 'Укажите часовой пояс',
                },
                birthday: {
                    required: 'Укажите дату рождения',
                    invalid: 'Некорректная дата',
                },
            },
        }
    },
    diaryInfo: {
        title: 'Регистрация',
        form: {
            description: {
                line1: 'Теперь заполните информацию о дневнике и значения по умолчанию.',
            },
            fields: {
                name: {
                    label: 'название дневника',
                },
                description: {
                    label: 'подзаголовок',
                },
                read_privacy: {
                    label: 'приватность чтения по умолчанию',
                    registered: 'зарегистрированные пользователи',
                    everyone: 'все',
                    friends: 'друзья',
                    nobody: 'только я',
                },
                comment_privacy: {
                    label: 'приватность комментариев по умолчанию',
                    registered: 'зарегистрированные пользователи',
                    everyone: 'все',
                    friends: 'друзья',
                    nobody: 'только я',
                },
                react_privacy: {
                    label: 'приватность реакций по умолчанию',
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
            validation: {
                name: {
                    required: 'Укажите название дневника',
                },
                description: {
                    required: 'Укажите подзаголовок',
                },
                read: {
                    required: 'Укажите приватность чтения',
                },
                comment: {
                    required: 'Укажите приватность комментариев',
                },
                react: {
                    required: 'Укажите приватность реакций',
                },
            },
        }
    },
    diaryImport: {
        title: 'Импорт дневника',
        form: {
            description: {
                line1: 'Вы можете импортировать свой дневник с другого сайта.',
            },
            fields: {
                website: {
                    label: 'сайт',
                },
                login: {
                    label: 'логин',
                },
                password: {
                    label: 'пароль',
                },
            },
            buttons: {
                send: {
                    label: 'импортировать',
                },
                skip: {
                    label: 'пропустить',
                },
                continue: {
                    label: 'продолжить',
                },
            }
        },
        import: {
            title: 'Импорт выполняется..'
        }
    },
    reactions: {
        reaction: {
            anonymous: 'аноним: '
        },
        add_reaction: {
            search: 'Искать реакции...',
            no_reactions: 'Реакции не найдены',
            recent: 'Недавние реакции',
            basic: 'Базовые реакции',
        },
        error: {
            'failed-to-load-basic': 'Не удалось загрузить базовые реакции',
            'failed-to-load-recent': 'Не удалось загрузить недавние реакции'
        },
    },
    avatarChooser: {
        oneTimeAvatar: 'ссылка',
    },
    post: {
        form: {
            title: {
                add: 'Новая запись:',
                edit: 'Редактирование:',
                repost: 'Репост:',
                repostTemplate: 'Репост:',
                repostCommentTemplate: 'Репост комментария'
            },
            fields: {
                title: {
                    label: 'Заголовок:',
                    defaultValue: 'Без названия',
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
                            tooltip: 'Подчеркнутый текст',
                        },
                        strikethrough: {
                            tooltip: 'Зачеркнутый текст',
                        },
                        expandable: {
                            tooltip: 'Добавить секцию \'Читать дальше..\'',
                        },
                        link: {
                            default_text: 'описание ссылки',
                            tooltip: 'Вставить ссылку',
                        },
                        image: {
                            tooltip: 'Вставить изображение',
                        },
                        slider: {
                            tooltip: 'Вставить слайдер',
                        },
                        left: {
                            tooltip: 'Выровнять текст по левому краю',
                        },
                        center: {
                            tooltip: 'Выровнять текст по центру',
                        },
                        right: {
                            tooltip: 'Выровнять текст по правому краю',
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
                        code: {
                            tooltip: 'Вставить блок кода',
                        },
                        css: {
                            tooltip: 'Добавить пользовательские CSS-классы',
                        },
                        mention: {
                            placeholder: 'Искать пользователей...',
                        },
                        quote: {
                            tooltip: 'Цитировать выделенное'
                        }
                    },
                },
                tags: {
                    label: 'теги:',
                },
                classes: {
                    label: 'html-классы:',
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
                    label: 'дополнительные параметры',
                },
            },
            button: {
                send: 'отправить',
                cancel: 'отмена',
                repost: 'репост',
                update: 'обновить',
            }
        },
        repost: {
            from: 'Репост из',
        },
        view: {
            footer: {
                buttons: {
                    delete: {
                        question: 'Вы уверены, что хотите удалить эту запись?',
                        confirm: 'Удалить',
                        cancel: 'Отмена',
                    },
                }
            }
        }
    },
    comment: {
        form: {
            title: 'Комментировать запись:',
            button: {
                send: 'добавить комментарий',
                cancel: 'отмена',
                apply: 'применить',
                reply: 'ответить',
                'cancel-reply': 'отмена',
                'quote': 'Цитата'
            },
            'replying-to': 'Ответ на',
            'show-preview': 'Показать комментарий',
            'hide-preview': 'Скрыть комментарий'
        },
        view: {
            footer: {
                buttons: {
                    delete: {
                        question: 'Вы уверены, что хотите удалить этот комментарий?',
                        confirm: 'Удалить',
                        cancel: 'Отмена',
                    },
                    reply: {
                        text: 'ответить',
                    },
                }
            }
        }
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
    userAvatar: {
        menu: {
            profile: 'Профиль',
            diary: 'Дневник',
            privateMessage: 'Личное сообщение',
            addFriend: 'Добавить в друзья',
            removeFriend: 'Удалить из друзей',
            block: 'Заблокировать'
        },
        dialog: {
            addFriend: {
                title: 'Добавить в друзья',
                label: 'Метка друга (необязательно)',
                message: 'Сообщение (необязательно)',
                cancel: 'Отмена',
                confirm: 'Добавить в друзья'
            },
            block: {
                title: 'Заблокировать пользователя',
                message: 'Вы уверены, что хотите заблокировать {nickname}?',
                warning: 'Вы не сможете видеть его записи, и отменить это действие будет невозможно в течение следующих 7 дней.',
                hideFromFeed: {
                    suggestion: 'Возможно, вы хотите скрыть его записи из своей ленты?',
                    button: 'Скрыть из ленты'
                },
                cancel: 'Отмена',
                confirm: 'Заблокировать'
            },
            removeFriend: {
                message: 'Вы уверены, что хотите удалить {nickname} из списка друзей?',
                title: 'Удалить из друзей',
                confirm: 'Да',
                cancel: 'Нет'
            }
        },
        notifications: {
            block: {
                success: 'Пользователь {nickname} был заблокирован',
                error: 'Не удалось заблокировать пользователя'
            },
            hideFromFeed: {
                success: 'Записи {nickname} будут скрыты из вашей ленты',
                error: 'Не удалось скрыть записи из ленты'
            },
            addFriend: {
                success: 'Запрос в друзья успешно отправлен',
                error: 'Не удалось отправить запрос в друзья'
            },
            removeFriend: {
                success: '{nickname} был удален из списка друзей',
                error: 'Не удалось удалить из друзей'
            }
        }
    },
    menu: {
        home: 'Главная',
        discussions: 'Обсуждения',
        profile: 'Профиль',
        diary: 'Дневник',
        messages: 'Сообщения',
        search: 'Поиск',
        darkTheme: 'Темная тема',
        lightTheme: 'Светлая тема',
        designOff: 'Отключить дизайн',
        settings: 'Настройки',
        logout: 'Выйти',
        collapse: 'Свернуть',
    },
    feed: {
        title: 'Лента',
        latest: 'Новые',
        popular: 'Популярные',
        following: 'Подписки',
        friends: 'Друзья'
    },
    avatars: {
        noAvatarsAvailable: 'Нет доступных аватаров',
        loading: 'Загрузка аватаров...',
        save: 'Сохранить',
        cancel: 'Отмена',
        changesSaved: 'Порядок аватаров успешно сохранен',
        addAvatar: 'Добавить аватар',
        uploadSuccess: 'Аватар(ы) успешно загружены',
        alreadyAdded: 'Аватар добавлен',
        addToCollection: 'Добавить в мою коллекцию',
        adding: 'Добавление...',
        added: 'Успешно добавлено',
        cropTitle: 'Обрезать изображение',
        cropConfirm: 'Обрезать',
    },
    errors: {
        failedToLoadAvatars: 'Не удалось загрузить аватары',
        failedToReorderAvatars: 'Не удалось изменить порядок аватаров',
        failedToUploadAvatars: 'Не удалось загрузить аватары',
        not_found: 'Страница или запись не найдена'
    },
    buttons: {
        go_home: 'На главную',
        go_back: 'Назад'
    },
    settings: {
        title: 'Настройки',
        search: {
            placeholder: 'Искать настройки...',
        },
        notYetImplemented: 'Пока не реализовано',
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
                    inviteCode: {
                        title: 'Инвайт-код',
                        triggers: {
                            invite: 'инвайт',
                            code: 'код',
                            invitation: 'приглашение',
                        },
                    },
                    language: {
                        title: 'Язык',
                        triggers: {
                            language: 'язык',
                            locale: 'локаль',
                            changeLanguage: 'изменить язык',
                        },
                    },
                    ignoreList: {
                        title: 'Список игнора',
                        triggers: {
                            ignore: 'игнор',
                            block: 'блок',
                            blockedUsers: 'заблокированные пользователи',
                        },
                    },
                    hiddenUsers: {
                        title: 'Скрытые пользователи',
                        triggers: {
                            hide: 'скрыть',
                            hidden: 'скрытые',
                            muteUsers: 'замьюченные пользователи',
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
                            intro: 'вступление',
                            description: 'описание',
                        },
                    },
                    defaultGroups: {
                        title: 'Группы по умолчанию',
                        triggers: {
                            default: 'по умолчанию',
                            autoAssign: 'автоматическое назначение',
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
                    deletedPosts: {
                        title: 'Удаленные записи',
                        triggers: {
                            deleted: 'удаленные',
                            trash: 'корзина',
                            removed: 'убранные',
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
                            upload: 'загрузка',
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
                    notify: 'уведомления',
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
                        title: 'Уведомления по электронной почте',
                        triggers: {
                            email: 'электронная почта',
                            mail: 'почта',
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
                        title: 'Электронная почта',
                        triggers: {
                            changeEmail: 'изменить электронную почту',
                            email: 'электронная почта',
                        },
                    },
                    activeSessions: {
                        title: 'Активные сессии',
                        triggers: {
                            sessions: 'сессии',
                            devices: 'устройства',
                            loggedIn: 'вход выполнен',
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
                            darkMode: 'темный режим',
                            look: 'вид',
                        },
                    },
                    accessibility: {
                        title: 'Доступность',
                        triggers: {
                            a11y: 'a11y',
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
        placeholder: 'Введите ваш никнейм',
        save: 'Сохранить',
        cancel: 'Отмена',
        saveSuccess: 'Никнейм успешно обновлен',
        saveError: 'Не удалось обновить никнейм',
        loadError: 'Не удалось загрузить никнейм',
        errors: {
            required: 'Никнейм обязателен',
            tooLong: 'Никнейм слишком длинный',
            alreadyExists: 'Никнейм уже существует',
        },
    },
    signatureSettings: {
        placeholder: 'Введите вашу подпись',
        save: 'Сохранить',
        cancel: 'Отмена',
        saveSuccess: 'Подпись успешно обновлена',
        saveError: 'Не удалось обновить подпись',
        loadError: 'Не удалось загрузить подпись',
        errors: {
            tooLong: 'Подпись слишком длинная (максимум 200 символов)',
        },
    },
    languageSettings: {
        placeholder: 'Выберите язык',
        save: 'Сохранить',
        cancel: 'Отмена',
        saveSuccess: 'Язык успешно обновлен',
        saveError: 'Не удалось обновить язык',
        loadError: 'Не удалось загрузить язык',
    },
    timezoneSettings: {
        placeholder: 'Выберите часовой пояс',
        save: 'Сохранить',
        cancel: 'Отмена',
        saveSuccess: 'Часовой пояс успешно обновлен',
        saveError: 'Не удалось обновить часовой пояс',
        loadError: 'Не удалось загрузить часовой пояс',
    },
    styles: {
        preview: {
            save: 'Добавить в мою коллекцию',
            alreadyAdded: 'Стиль добавлен',
            goToCollection: 'Перейти к коллекции стилей',
        },
        form: {
            title: {
                add: 'Добавить новый стиль',
                edit: 'Редактировать стиль',
            },
            name: {
                placeholder: 'введите название стиля',
            },
            description: {
                placeholder: 'введите описание стиля',
            },
            css: {
                placeholder: 'введите содержимое CSS-стиля',
            },
            button: {
                add: 'добавить стиль',
                update: 'обновить стиль',
                cancel: 'отмена',
            }
        },
        footer: {
            delete: {
                confirmation: 'Вы уверены, что хотите удалить этот стиль?',
            },
        },
        reorder: {
            button: {
                save: 'сохранить порядок',
                cancel: 'отмена',
            },
        },
        title: 'Стили дневника',
        addNew: 'Добавить новый стиль',
        addNewStyle: 'Добавить новый стиль',
        save: 'Сохранить изменения',
        cancel: 'Отменить изменения',
        add: 'добавить стиль',
        name: 'Название',
        styleContent: 'Содержимое CSS-стиля',
        enabled: 'Включено',
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
        requiredFields: 'Название и содержимое CSS-стиля обязательны',
        previewUrlApplied: 'URL изображения предпросмотра успешно применен'
    },
    ignoreListSettings: {
        empty: 'Ваш список игнора пуст.',
        loading: 'Загрузка...',
        loadError: 'Не удалось загрузить список игнора.',
        confirmTitle: 'Убрать из игнора',
        confirmUnignore: 'Вы уверены, что хотите убрать {nickname} из игнора?',
        confirm: 'Убрать из игнора',
        cancel: 'Отмена',
        unignoreSuccess: '{nickname} был удален из вашего списка игнора.',
    },
    hiddenUsersSettings: {
        loading: 'Загрузка...',
        loadError: 'Не удалось загрузить список скрытых пользователей.',
        empty: 'Ваш список скрытых пользователей пуст.',
        confirmTitle: 'Показать пользователя',
        confirmUnhide: 'Вы уверены, что хотите убрать {nickname} из скрытых?',
        confirm: 'Показать',
        cancel: 'Отмена',
        unhideSuccess: '{nickname} был удален из списка скрытых пользователей.',
    },
    diaryTitleSettings: {
        titlePlaceholder: 'Название дневника',
        subtitlePlaceholder: 'Подзаголовок дневника',
        save: 'Сохранить',
        cancel: 'Отмена',
        saveSuccess: 'Название дневника успешно обновлено',
        saveError: 'Не удалось обновить название дневника',
        loadError: 'Не удалось загрузить название дневника',
    },
    headerNotifications: {
        title: 'Уведомления',
        noNotifications: 'Нет уведомлений',
    },
    notificationTypes: {
        COMMENT: 'Новый комментарий',
        NEW_POST: 'Новая запись',
        COMMENT_REPLY: 'Ответ на комментарий',
        POST_REACTION: 'Реакция на запись',
        COMMENT_REACTION: 'Реакция на комментарий',
        POST_MENTION: 'Упоминание в записи',
        COMMENT_MENTION: 'Упоминание в комментарии',
        PRIVATE_MESSAGE: 'Личное сообщение',
        FRIEND_REQUEST: 'Заявка в друзья',
        REPOST: 'Репост',
        COMMENT_REPOST: 'Репост комментария',
    },
    notificationItem: {
        markAsRead: 'Отметить как прочитанное',
        from: 'От {user}',
        viewPost: 'Перейти к записи',
        openChat: 'Открыть чат',
        viewProfile: 'Перейти к профилю',
        timeJustNow: 'Только что',
        timeMinutesAgo: '{n} мин назад',
        timeHoursAgo: '{n} ч назад',
        timeYesterday: 'Вчера',
        postReactionText: '{nickname} добавил(а) реакцию {reaction} к вашей записи: {post}',
        commentReactionText: '{nickname} добавил(а) реакцию {reaction} к вашему комментарию в записи: {post}',
        commentText: '{nickname} оставил(а) комментарий к вашей записи: {post}',
        commentReplyText: '{nickname} ответил(а) на ваш комментарий в записи: {post}',
    },
}
