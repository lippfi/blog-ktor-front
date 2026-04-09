export default {
    search: {
        title: 'Іздеу',
        placeholder: 'Жазбаларды іздеу...',
        advanced: {
            label: 'Кеңейтілген іздеу',
            tags: {
                label: 'Тегтер',
                placeholder: 'Тегтерді енгізіңіз'
            },
            tagPolicy: {
                label: 'Тегтерді сәйкестендіру',
                union: 'кез келген тег (НЕМЕСЕ)',
                intersection: 'барлық тегтер (ЖӘНЕ)'
            },
            from: {
                label: 'Басталу күні',
                placeholder: 'Басталу күнін таңдаңыз'
            },
            to: {
                label: 'Аяқталу күні',
                placeholder: 'Аяқталу күнін таңдаңыз'
            },
            sorting: {
                label: 'Сұрыптау',
                field: {
                    label: 'Өріс',
                    creationTime: 'Күні',
                    title: 'Тақырып'
                },
                order: {
                    label: 'Реті',
                    asc: 'алдымен ескілері',
                    desc: 'алдымен жаңалары'
                }
            }
        },
        button: {
            search: 'Іздеу',
            clear: 'Тазарту'
        },
        noPostsFound: 'Жазбалар табылмады'
    },
    registration: {
        title: 'Тіркелу',
        form: {
            header: 'Тіркелу',
            fields: {
                login: {
                    label: 'логин',
                },
                nickname: {
                    label: 'лақап ат',
                },
                email: {
                    label: 'электрондық пошта',
                },
                password: {
                    label: 'құпиясөз',
                },
                password_confirmation: {
                    label: 'құпиясөзді растау',
                },
                invite_code: {
                    code_required: 'Шақыру коды қажет',
                    before_admin: 'Оны сайт мүшесінен алыңыз немесе мынаған жазыңыз: ',
                    admin: 'әкімші',
                    after_admin: '.',
                    label: 'шақыру коды'
                },
            },
            button: {
                label: 'тіркелу',
            },
            errors: {
                login_required: 'Логин қажет',
                login_too_long: 'Логин тым ұзын',
                login_exists: 'Мұндай логин бұрыннан бар',
                nickname_required: 'Лақап ат қажет',
                nickname_too_long: 'Лақап ат тым ұзын',
                nickname_exists: 'Мұндай лақап ат бұрыннан бар',
                email_required: 'Электрондық пошта қажет',
                email_invalid: 'Электрондық пошта қате',
                email_exists: 'Мұндай электрондық пошта бұрыннан бар',
                email_too_long: 'Электрондық пошта тым ұзын',
                password_required: 'Құпиясөз қажет',
                password_confirmation_required: 'Құпиясөзді растау қажет',
                passwords_mismatch: 'Құпиясөздер сәйкес келмейді',
                invite_code_required: 'Шақыру коды қажет',
            },
            exceptions: {
                email_exists: 'Мұндай электрондық пошта бұрыннан бар',
                nickname_exists: 'Мұндай лақап ат бұрыннан бар',
                login_exists: 'Мұндай логин бұрыннан бар',
                invalid_invite_code: 'Жарамсыз шақыру коды',
                unknown: 'Белгісіз қате. Кейінірек қайталап көріңіз немесе әкімшіге хабарласыңыз',
            },
        },
    },
    email_confirmation: {
        title: "Электрондық поштаны растау",
        form: {
            header: "Электрондық поштаны растау",
            fields: {
                code: {
                    label: "растау коды",
                },
                message: {
                    line1: "Электрондық поштаңызға растау коды жіберілді.",
                    line2: "Электрондық поштаңызды растау үшін кодты енгізіңіз.",
                }
            },
            button: {
                label: "растау",
            }
        }
    },
    login: {
        title: 'Кіру',
        form: {
            header: 'Қош келдіңіз',
            fields: {
                login: {
                    label: 'логин',
                },
                password: {
                    label: 'құпиясөз',
                },
            },
            button: {
                label: 'кіру',
            },
            errors: {
                login_required: 'Логин қажет',
                password_required: 'Құпиясөз қажет',
            },
            exceptions: {
                invalid_credentials: 'Қате тіркелгі деректері',
            },
            forgot_password: {
                label: 'құпиясөзді ұмыттым',
            }
        },
    },
    reset: {
        title: 'Құпиясөзді қалпына келтіру',
        form: {
            header: 'Құпиясөзді қалпына келтіру',
            fields: {
                identifier: {
                    label: 'электрондық пошта немесе логин',
                },
                code: {
                    label: 'растау коды',
                },
                password: {
                    label: 'құпиясөз',
                },
                password_confirmation: {
                    label: 'құпиясөзді растау',
                },
            },
            description: {
                line1: 'Электрондық поштаңызға растау коды жіберілді.',
            },
            errors: {
                field_required: 'Өріс міндетті',
                password_required: 'Құпиясөз қажет',
                password_confirmation_required: 'Құпиясөзді растау қажет',
                passwords_mismatch: 'Құпиясөздер сәйкес келмейді',
            },
            button: {
                label: 'келесі',
            },
            button2: {
                label: 'растау',
            },
        },
    },
    additionalInfo: {
        title: 'Тіркелу',
        form: {
            description: {
                line1: 'Сіз тіркелдіңіз.',
                line2: 'Профиліңізді аяқтау үшін төмендегі ақпаратты толтырыңыз.',
            },
            fields: {
                sex: {
                    label: 'жыныс',
                    male: 'ер',
                    female: 'әйел',
                    unknown: 'белгісіз',
                },
                timezone: {
                    label: 'уақыт белдеуі',
                },
                language: {
                    label: 'қалаулы тіл',
                    en: 'Ағылшын',
                    kk: 'Qazaq',
                    kk_cyrillic: 'Қазақ',
                    ru: 'Орысша',
                },
                nsfw: {
                    label: 'NSFW саясаты',
                    show: 'көрсету',
                    hide: 'көрсетпеу',
                    warn: 'көрсетпес бұрын бұлыңғырлау',
                },
                birthday: {
                    label: 'туған күні',
                },
            },
            buttons: {
                send: {
                    label: 'растау',
                },
                skip: {
                    label: 'өткізіп жіберу',
                },
            },
        }
    },
    diaryInfo: {
        title: 'Тіркелу',
        form: {
            description: {
                line1: 'Енді күнделік туралы ақпарат пен әдепкі баптауларды толтырыңыз.',
            },
            fields: {
                name: {
                    label: 'күнделік атауы',
                },
                description: {
                    label: 'қосымша тақырып',
                },
                read_privacy: {
                    label: 'оқуға арналған әдепкі құпиялық',
                    registered: 'тіркелген қолданушылар',
                    everyone: 'барлығы',
                    friends: 'достар',
                    nobody: 'тек мен',
                },
                comment_privacy: {
                    label: 'пікірге арналған әдепкі құпиялық',
                    registered: 'тіркелген қолданушылар',
                    everyone: 'барлығы',
                    friends: 'достар',
                    nobody: 'тек мен',
                },
                react_privacy: {
                    label: 'реакцияға арналған әдепкі құпиялық',
                    registered: 'тіркелген қолданушылар',
                    everyone: 'барлығы',
                    friends: 'достар',
                    nobody: 'тек мен',
                },
            },
            buttons: {
                send: {
                    label: 'жіберу',
                },
                skip: {
                    label: 'өткізіп жіберу',
                },
            },
            validation: {
                name: {
                    required: 'Күнделік атауын көрсетіңіз',
                },
                description: {
                    required: 'Қосымша тақырыпты көрсетіңіз',
                },
                read: {
                    required: 'Оқу құпиялығын көрсетіңіз',
                },
                comment: {
                    required: 'Пікір құпиялығын көрсетіңіз',
                },
                react: {
                    required: 'Реакция құпиялығын көрсетіңіз',
                },
            },
        }
    },
    diaryImport: {
        title: 'Күнделік импорттау',
        form: {
            description: {
                line1: 'Күнделігіңізді басқа сайттан импорттай аласыз.',
            },
            fields: {
                website: {
                    label: 'сайт',
                },
                login: {
                    label: 'логин',
                },
                password: {
                    label: 'құпиясөз',
                },
            },
            buttons: {
                send: {
                    label: 'импорттау',
                },
                skip: {
                    label: 'өткізіп жіберу',
                },
                continue: {
                    label: 'жалғастыру',
                },
            }
        },
        import: {
            title: 'Импорт жүріп жатыр..'
        }
    },
    reactions: {
        reaction: {
            anonymous: 'аноним: '
        },
        add_reaction: {
            search: 'Реакцияларды іздеу...',
            no_reactions: 'Реакциялар табылмады',
            recent: 'Соңғы реакциялар',
            basic: 'Негізгі реакциялар',
        },
        error: {
            'failed-to-load-basic': 'Негізгі реакцияларды жүктеу сәтсіз аяқталды',
            'failed-to-load-recent': 'Соңғы реакцияларды жүктеу сәтсіз аяқталды'
        },
    },
    avatarChooser: {
        oneTimeAvatar: 'сілтеме',
    },
    post: {
        form: {
            title: {
                add: 'Жаңа жазба:',
                edit: 'Өңдеу:',
                repost: 'Қайта жариялау:',
                repostTemplate: 'Қайта жариялау:',
                repostCommentTemplate: 'Пікірді қайта жариялау'
            },
            fields: {
                title: {
                    label: 'Тақырып:',
                    defaultValue: 'Атаусыз',
                },
                textarea: {
                    buttons: {
                        bold: {
                            tooltip: 'Қалың мәтін',
                        },
                        italic: {
                            tooltip: 'Көлбеу мәтін',
                        },
                        underline: {
                            tooltip: 'Асты сызылған мәтін',
                        },
                        strikethrough: {
                            tooltip: 'Сызылған мәтін',
                        },
                        expandable: {
                            tooltip: '\'Толығырақ оқу..\' бөлімін қосу',
                        },
                        link: {
                            default_text: 'сілтеме сипаттамасы',
                            tooltip: 'Сілтеме кірістіру',
                        },
                        image: {
                            tooltip: 'Сурет кірістіру',
                        },
                        slider: {
                            tooltip: 'Слайдер кірістіру',
                        },
                        left: {
                            tooltip: 'Мәтінді сол жаққа туралау',
                        },
                        center: {
                            tooltip: 'Мәтінді ортаға туралау',
                        },
                        right: {
                            tooltip: 'Мәтінді оң жаққа туралау',
                        },
                        bigger: {
                            tooltip: 'Мәтін өлшемін үлкейту',
                        },
                        smaller: {
                            tooltip: 'Мәтін өлшемін кішірейту',
                        },
                        gothic: {
                            tooltip: 'Готикалық қаріп',
                        },
                        code: {
                            tooltip: 'Код блогын кірістіру',
                        },
                        css: {
                            tooltip: 'Арнайы CSS кластары қосу',
                        },
                        mention: {
                            placeholder: 'Қолданушыларды іздеу...',
                        },
                        quote: {
                            tooltip: 'Таңдалғанды дәйексөзге айналдыру'
                        }
                    },
                },
                tags: {
                    label: 'тегтер:',
                },
                classes: {
                    label: 'html кластары:',
                },
                read: {
                    label: 'оқу:',
                },
                comment: {
                    label: 'пікір:',
                },
                react: {
                    label: 'реакция:',
                },
                advanced: {
                    label: 'қосымша параметрлер',
                },
            },
            button: {
                send: 'жіберу',
                cancel: 'бас тарту',
                repost: 'қайта жариялау',
                update: 'жаңарту',
            }
        },
        repost: {
            from: 'Қайта жарияланған жері',
        },
        view: {
            footer: {
                buttons: {
                    delete: {
                        question: 'Бұл жазбаны өшіргіңіз келетініне сенімдісіз бе?',
                        confirm: 'Өшіру',
                        cancel: 'Бас тарту',
                    },
                }
            }
        }
    },
    comment: {
        form: {
            title: 'Жазбаға пікір жазу:',
            button: {
                send: 'пікір қосу',
                cancel: 'бас тарту',
                apply: 'қолдану',
                reply: 'жауап беру',
                'cancel-reply': 'бас тарту',
                'quote': 'Дәйексөз'
            },
            'replying-to': 'Мынаған жауап берілуде',
            'show-preview': 'Пікірді көрсету',
            'hide-preview': 'Пікірді жасыру'
        },
        view: {
            footer: {
                buttons: {
                    delete: {
                        question: 'Бұл пікірді өшіргіңіз келетініне сенімдісіз бе?',
                        confirm: 'Өшіру',
                        cancel: 'Бас тарту',
                    },
                    reply: {
                        text: 'жауап беру',
                    },
                }
            }
        }
    },
    groups: {
        basic: {
            everyone: {
                label: 'барлығы',
            },
            registered: {
                label: 'тіркелген қолданушылар',
            },
            friends: {
                label: 'достар',
            },
            nobody: {
                label: 'тек мен',
            },
        }
    },
    userAvatar: {
        menu: {
            profile: 'Профиль',
            diary: 'Күнделік',
            privateMessage: 'Жеке хабарлама',
            addFriend: 'Досқа қосу',
            removeFriend: 'Достардан өшіру',
            block: 'Бұғаттау'
        },
        dialog: {
            addFriend: {
                title: 'Досқа қосу',
                label: 'Дос белгісі (міндетті емес)',
                message: 'Хабарлама (міндетті емес)',
                cancel: 'Бас тарту',
                confirm: 'Досқа қосу'
            },
            block: {
                title: 'Қолданушыны бұғаттау',
                message: '{nickname} қолданушысын бұғаттағыңыз келетініне сенімдісіз бе?',
                warning: 'Сіз оның жазбаларын көре алмайсыз және бұл әрекетті келесі 7 күн ішінде кері қайтара алмайсыз.',
                hideFromFeed: {
                    suggestion: 'Мүмкін, оның жазбаларын таспаңыздан жасырғыңыз келетін шығар?',
                    button: 'Таспадан жасыру'
                },
                cancel: 'Бас тарту',
                confirm: 'Бұғаттау'
            },
            removeFriend: {
                message: '{nickname} қолданушысын достар тізімінен өшіргіңіз келетініне сенімдісіз бе?',
                title: 'Досты өшіру',
                confirm: 'Иә',
                cancel: 'Жоқ'
            }
        },
        notifications: {
            block: {
                success: '{nickname} қолданушысы бұғатталды',
                error: 'Қолданушыны бұғаттау сәтсіз аяқталды'
            },
            hideFromFeed: {
                success: '{nickname} жазбалары таспаңыздан жасырылады',
                error: 'Жазбаларды таспадан жасыру сәтсіз аяқталды'
            },
            addFriend: {
                success: 'Достық сұрауы сәтті жіберілді',
                error: 'Достық сұрауын жіберу сәтсіз аяқталды'
            },
            removeFriend: {
                success: '{nickname} достар тізімінен өшірілді',
                error: 'Досты өшіру сәтсіз аяқталды'
            }
        }
    },
    menu: {
        home: 'Басты бет',
        discussions: 'Талқылаулар',
        profile: 'Профиль',
        diary: 'Күнделік',
        messages: 'Хабарламалар',
        search: 'Іздеу',
        darkTheme: 'Қараңғы тақырып',
        lightTheme: 'Жарық тақырып',
        designOff: 'Дизайнды өшіру',
        settings: 'Баптаулар',
        logout: 'Шығу',
        collapse: 'Жию',
    },
    feed: {
        title: 'Лента',
        latest: 'Соңғылары',
        popular: 'Танымал',
        following: 'Жазылымдар',
        friends: 'Достар'
    },
    avatars: {
        noAvatarsAvailable: 'Қолжетімді аватарлар жоқ',
        loading: 'Аватарлар жүктелуде...',
        save: 'Сақтау',
        cancel: 'Бас тарту',
        changesSaved: 'Аватарлар реті сәтті сақталды',
        addAvatar: 'Аватар қосу',
        uploadSuccess: 'Аватар(лар) сәтті жүктелді',
        alreadyAdded: 'Аватар қосылды',
        addToCollection: 'Жинағыма қосу',
        adding: 'Қосылуда...',
        added: 'Сәтті қосылды',
        cropTitle: 'Суретті қию',
        cropConfirm: 'Қию',
    },
    errors: {
        failedToLoadAvatars: 'Аватарларды жүктеу сәтсіз аяқталды',
        failedToReorderAvatars: 'Аватарлар ретін өзгерту сәтсіз аяқталды',
        failedToUploadAvatars: 'Аватарларды жүктеу сәтсіз аяқталды',
        not_found: 'Бет немесе жазба табылмады'
    },
    buttons: {
        go_home: 'Басты бетке өту',
        go_back: 'Артқа қайту'
    },
    settings: {
        title: 'Баптаулар',
        search: {
            placeholder: 'Баптауларды іздеу...',
        },
        notYetImplemented: 'Әзірге іске асырылмаған',
        categories: {
            user: {
                title: 'Қолданушы',
                triggers: {
                    account: 'аккаунт',
                    profile: 'профиль',
                    userSettings: 'қолданушы баптаулары',
                },
                items: {
                    nickname: {
                        title: 'Лақап ат',
                        triggers: {
                            username: 'пайдаланушы аты',
                            changeUsername: 'пайдаланушы атын өзгерту',
                            changeNickname: 'лақап атты өзгерту',
                        },
                    },
                    signature: {
                        title: 'Қолтаңба',
                        triggers: {
                            bio: 'био',
                            status: 'мәртебе',
                        },
                    },
                    timezone: {
                        title: 'Уақыт белдеуі',
                        triggers: {
                            time: 'уақыт',
                            zone: 'белдеу',
                            clock: 'сағат',
                        },
                    },
                    inviteCode: {
                        title: 'Шақыру коды',
                        triggers: {
                            invite: 'шақыру',
                            code: 'код',
                            invitation: 'шақыру',
                        },
                    },
                    language: {
                        title: 'Тіл',
                        triggers: {
                            language: 'тіл',
                            locale: 'локаль',
                            changeLanguage: 'тілді өзгерту',
                        },
                    },
                    ignoreList: {
                        title: 'Елемеу тізімі',
                        triggers: {
                            ignore: 'елемеу',
                            block: 'бұғаттау',
                            blockedUsers: 'бұғатталған қолданушылар',
                        },
                    },
                    hiddenUsers: {
                        title: 'Жасырылған қолданушылар',
                        triggers: {
                            hide: 'жасыру',
                            hidden: 'жасырылған',
                            muteUsers: 'үнсіз қолданушылар',
                        },
                    },
                },
            },
            diary: {
                title: 'Күнделік',
                triggers: {
                    blog: 'блог',
                    journal: 'журнал',
                },
                items: {
                    diaryTitle: {
                        title: 'Күнделік атауы',
                        triggers: {
                            blogName: 'блог атауы',
                            diaryName: 'күнделік атауы',
                        },
                    },
                    preface: {
                        title: 'Кіріспе',
                        triggers: {
                            intro: 'кіріспе',
                            description: 'сипаттама',
                        },
                    },
                    defaultGroups: {
                        title: 'Әдепкі топтар',
                        triggers: {
                            default: 'әдепкі',
                            autoAssign: 'автоматты тағайындау',
                        },
                    },
                    manageGroups: {
                        title: 'Топтарды басқару',
                        triggers: {
                            manage: 'басқару',
                            groups: 'топтар',
                            memberGroups: 'мүше топтары',
                        },
                    },
                    hiddenPosts: {
                        title: 'Жасырылған жазбалар',
                        triggers: {
                            hidden: 'жасырылған',
                            private: 'жеке',
                            visibility: 'көрінуі',
                        },
                    },
                    deletedPosts: {
                        title: 'Өшірілген жазбалар',
                        triggers: {
                            deleted: 'өшірілген',
                            trash: 'себет',
                            removed: 'алынып тасталған',
                        },
                    },
                },
            },
            avatars: {
                title: 'Аватарлар',
                triggers: {
                    avatar: 'аватар',
                    profilePicture: 'профиль суреті',
                    photo: 'фото',
                },
                items: {
                    avatars: {
                        title: 'Аватарлар',
                        triggers: {
                            manage: 'басқару',
                            upload: 'жүктеу',
                        },
                    },
                },
            },
            reactions: {
                title: 'Реакциялар',
                triggers: {
                    emoji: 'эмодзи',
                    react: 'реакция',
                },
                items: {
                    createReactionPack: {
                        title: 'Реакциялар жинағын жасау',
                        triggers: {
                            create: 'жасау',
                            newPack: 'жаңа жинақ',
                        },
                    },
                    myReactionPacks: {
                        title: 'Менің реакциялар жинақтарым',
                        triggers: {
                            packs: 'жинақтар',
                            manage: 'басқару',
                        },
                    },
                },
            },
            notifications: {
                title: 'Хабарландырулар',
                triggers: {
                    alerts: 'ескертулер',
                    notify: 'хабарлау',
                },
                items: {
                    onsiteNotifications: {
                        title: 'Сайт ішіндегі хабарландырулар',
                        triggers: {
                            onsite: 'сайт ішінде',
                            web: 'веб',
                        },
                    },
                    emailNotifications: {
                        title: 'Электрондық пошта хабарландырулары',
                        triggers: {
                            email: 'электрондық пошта',
                            mail: 'пошта',
                        },
                    },
                },
            },
            security: {
                title: 'Қауіпсіздік',
                triggers: {
                    safety: 'қауіпсіздік',
                    protection: 'қорғаныс',
                },
                items: {
                    password: {
                        title: 'Құпиясөз',
                        triggers: {
                            changePassword: 'құпиясөзді өзгерту',
                            resetPassword: 'құпиясөзді қалпына келтіру',
                        },
                    },
                    emailAddress: {
                        title: 'Электрондық пошта мекенжайы',
                        triggers: {
                            changeEmail: 'электрондық поштаны өзгерту',
                            email: 'электрондық пошта',
                        },
                    },
                    activeSessions: {
                        title: 'Белсенді сеанстар',
                        triggers: {
                            sessions: 'сеанстар',
                            devices: 'құрылғылар',
                            loggedIn: 'жүйеге кірген',
                        },
                    },
                    twoFactorAuth: {
                        title: 'Екі факторлы аутентификация',
                        triggers: {
                            twoFactor: 'екі факторлы',
                            totp: 'totp',
                            authenticator: 'аутентификатор',
                        },
                    },
                },
            },
            preferences: {
                title: 'Қалаулар',
                triggers: {
                    customize: 'баптау',
                    options: 'параметрлер',
                },
                items: {
                    appearance: {
                        title: 'Сыртқы көрініс',
                        triggers: {
                            theme: 'тақырып',
                            darkMode: 'қараңғы режим',
                            look: 'көрініс',
                        },
                    },
                    accessibility: {
                        title: 'Қолжетімділік',
                        triggers: {
                            a11y: 'a11y',
                            screenReader: 'экраннан оқу құралы',
                        },
                    },
                    layout: {
                        title: 'Орналасу',
                        triggers: {
                            columns: 'бағандар',
                            arrangement: 'орналасу',
                        },
                    },
                },
            },
        },
    },
    nicknameSettings: {
        placeholder: 'Лақап атыңызды енгізіңіз',
        save: 'Сақтау',
        cancel: 'Бас тарту',
        saveSuccess: 'Лақап ат сәтті жаңартылды',
        saveError: 'Лақап атты жаңарту сәтсіз аяқталды',
        loadError: 'Лақап атты жүктеу сәтсіз аяқталды',
        errors: {
            required: 'Лақап ат қажет',
            tooLong: 'Лақап ат тым ұзын',
            alreadyExists: 'Мұндай лақап ат бұрыннан бар',
        },
    },
    signatureSettings: {
        placeholder: 'Қолтаңбаңызды енгізіңіз',
        save: 'Сақтау',
        cancel: 'Бас тарту',
        saveSuccess: 'Қолтаңба сәтті жаңартылды',
        saveError: 'Қолтаңбаны жаңарту сәтсіз аяқталды',
        loadError: 'Қолтаңбаны жүктеу сәтсіз аяқталды',
        errors: {
            tooLong: 'Қолтаңба тым ұзын (ең көбі 200 таңба)',
        },
    },
    languageSettings: {
        placeholder: 'Тілді таңдаңыз',
        save: 'Сақтау',
        cancel: 'Бас тарту',
        saveSuccess: 'Тіл сәтті жаңартылды',
        saveError: 'Тілді жаңарту сәтсіз аяқталды',
        loadError: 'Тілді жүктеу сәтсіз аяқталды',
    },
    timezoneSettings: {
        placeholder: 'Уақыт белдеуін таңдаңыз',
        save: 'Сақтау',
        cancel: 'Бас тарту',
        saveSuccess: 'Уақыт белдеуі сәтті жаңартылды',
        saveError: 'Уақыт белдеуін жаңарту сәтсіз аяқталды',
        loadError: 'Уақыт белдеуін жүктеу сәтсіз аяқталды',
    },
    styles: {
        preview: {
            save: 'Жинағыма қосу',
            alreadyAdded: 'Стиль қосылды',
            goToCollection: 'Стильдер жинағына өту',
        },
        form: {
            title: {
                add: 'Жаңа стиль қосу',
                edit: 'Стильді өңдеу',
            },
            name: {
                placeholder: 'стиль атауын енгізіңіз',
            },
            description: {
                placeholder: 'стиль сипаттамасын енгізіңіз',
            },
            css: {
                placeholder: 'CSS стиль мазмұнын енгізіңіз',
            },
            button: {
                add: 'стиль қосу',
                update: 'стильді жаңарту',
                cancel: 'бас тарту',
            }
        },
        footer: {
            delete: {
                confirmation: 'Бұл стильді өшіргіңіз келетініне сенімдісіз бе?',
            },
        },
        reorder: {
            button: {
                save: 'ретін сақтау',
                cancel: 'бас тарту',
            },
        },
        title: 'Күнделік стильдері',
        addNew: 'Жаңа стиль қосу',
        addNewStyle: 'Жаңа стиль қосу',
        save: 'Өзгерістерді сақтау',
        cancel: 'Өзгерістерді болдырмау',
        add: 'стиль қосу',
        name: 'Атауы',
        styleContent: 'CSS стиль мазмұны',
        enabled: 'Қосулы',
        previewImage: 'Алдын ала қарау суреті',
        confirmDelete: 'Бұл стильді өшіргіңіз келетініне сенімдісіз бе?',
        loadError: 'Стильдерді жүктеу сәтсіз аяқталды',
        updateSuccess: 'Стиль сәтті жаңартылды',
        updateError: 'Стильді жаңарту сәтсіз аяқталды',
        addSuccess: 'Стиль сәтті қосылды',
        addError: 'Стиль қосу сәтсіз аяқталды',
        deleteSuccess: 'Стиль сәтті өшірілді',
        deleteError: 'Стильді өшіру сәтсіз аяқталды',
        saveSuccess: 'Өзгерістер сәтті сақталды',
        saveError: 'Өзгерістерді сақтау сәтсіз аяқталды',
        changesCancelled: 'Өзгерістер болдырылмады',
        requiredFields: 'Атауы мен CSS стиль мазмұны міндетті',
        previewUrlApplied: 'Алдын ала қарау суретінің URL мекенжайы сәтті қолданылды'
    },
    ignoreListSettings: {
        empty: 'Сіздің елемеу тізіміңіз бос.',
        loading: 'Жүктелуде...',
        loadError: 'Елемеу тізімін жүктеу сәтсіз аяқталды.',
        confirmTitle: 'Елемеуден шығару',
        confirmUnignore: '{nickname} қолданушысын елемеу тізімінен шығарғыңыз келетініне сенімдісіз бе?',
        confirm: 'Елемеуден шығару',
        cancel: 'Бас тарту',
        unignoreSuccess: '{nickname} елемеу тізіміңізден өшірілді.',
    },
    hiddenUsersSettings: {
        loading: 'Жүктелуде...',
        loadError: 'Жасырылған қолданушылар тізімін жүктеу сәтсіз аяқталды.',
        empty: 'Сіздің жасырылған қолданушылар тізіміңіз бос.',
        confirmTitle: 'Жасырудан шығару',
        confirmUnhide: '{nickname} қолданушысын жасырудан шығарғыңыз келетініне сенімдісіз бе?',
        confirm: 'Жасырудан шығару',
        cancel: 'Бас тарту',
        unhideSuccess: '{nickname} жасырылған қолданушылар тізіміңізден өшірілді.',
    },
    diaryTitleSettings: {
        titlePlaceholder: 'Күнделік атауы',
        subtitlePlaceholder: 'Күнделік қосымша тақырыбы',
        save: 'Сақтау',
        cancel: 'Бас тарту',
        saveSuccess: 'Күнделік атауы сәтті жаңартылды',
        saveError: 'Күнделік атауын жаңарту сәтсіз аяқталды',
        loadError: 'Күнделік атауын жүктеу сәтсіз аяқталды',
    },
    headerNotifications: {
        title: 'Хабарламалар',
        noNotifications: 'Хабарлама жоқ',
    },
    notificationTypes: {
        COMMENT: 'Жаңа пікір',
        NEW_POST: 'Жаңа жазба',
        COMMENT_REPLY: 'Пікірге жауап',
        POST_REACTION: 'Жазбаға реакция',
        COMMENT_REACTION: 'Пікірге реакция',
        POST_MENTION: 'Жазбада аталды',
        COMMENT_MENTION: 'Пікірде аталды',
        PRIVATE_MESSAGE: 'Жеке хабарлама',
        FRIEND_REQUEST: 'Достық сұранысы',
        REPOST: 'Репост',
        COMMENT_REPOST: 'Пікір репосты',
    },
    notificationItem: {
        markAsRead: 'Оқылды деп белгілеу',
        from: '{user} жіберді',
        viewPost: 'Жазбаны көру',
        openChat: 'Чатты ашу',
        viewProfile: 'Профильді көру',
        timeJustNow: 'Жаңа ғана',
        timeMinutesAgo: '{n} мин бұрын',
        timeHoursAgo: '{n} сағ бұрын',
        timeYesterday: 'Кеше',
        postReactionText: '{nickname} сіздің жазбаңызға {reaction} реакция қосты: {post}',
        commentReactionText: '{nickname} сіздің пікіріңізге {reaction} реакция қосты, жазба: {post}',
        commentText: '{nickname} сіздің жазбаңызға пікір қалдырды: {post}',
        commentReplyText: '{nickname} сіздің пікіріңізге жауап берді жазбада: {post}',
        repostText: '{nickname} сіздің жазбаңызды репост жасады: {post}',
        commentRepostText: '{nickname} сіздің пікіріңізді репост жасады: {post}',
        postMentionText: '{nickname} сізді жазбада атап өтті: {post}',
        commentMentionText: '{nickname} сізді жазбаға пікірде атап өтті: {post}',
    },
}
