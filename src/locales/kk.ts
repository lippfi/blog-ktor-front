export default {
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
                    label: 'email',
                },
                password: {
                    label: 'құпия сөз',
                },
                password_confirmation: {
                    label: 'құпия сөзді растау',
                },
                invite_code: {
                    code_required: 'Шақыру коды қажет',
                    before_admin: 'Мүшеден алыңыз немесе ',
                    admin: 'әкімшімен',
                    after_admin: ' байланысыңыз.',
                    label: 'шақыру коды'
                },
            },
            button: {
                label: 'тіркелу',
            },
            errors: {
                login_required: 'Логин қажет',
                login_too_long: 'Логин тым ұзын',
                login_exists: 'Логин бос емес',
                nickname_required: 'Лақап ат қажет',
                nickname_too_long: 'Лақап ат тым ұзын',
                nickname_exists: 'Лақап ат бос емес',
                email_required: 'Email қажет',
                email_invalid: 'Email қате',
                email_exists: 'Email бос емес',
                email_too_long: 'Email тым ұзын',
                password_required: 'Құпия сөз қажет',
                password_confirmation_required: 'Құпия сөзді растау қажет',
                passwords_mismatch: 'Құпия сөздер сәйкес емес',
                invite_code_required: 'Шақыру коды қажет',
            },
            exceptions: {
                email_exists: 'Email бос емес',
                nickname_exists: 'Лақап ат бос емес',
                login_exists: 'Логин бос емес',
                invalid_invite_code: 'Шақыру коды қате',
                unknown: 'Белгісіз қате. Кейінірек қайталаңыз немесе әкімшімен байланысыңыз',
            },
        },
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
                    label: 'құпия сөз',
                },
            },
            button: {
                label: 'кіру',
            },
            errors: {
                login_required: 'Логин қажет',
                password_required: 'Құпия сөз қажет',
            },
            exceptions: {
                invalid_credentials: 'Логин немесе құпия сөз қате',
            },
        },
    },
    additionalInfo: {
        title: 'Тіркелу',
        form: {
            description: {
                line1: 'Сіз тіркелдіңіз.',
                line2: 'Профиліңізді толықтыру үшін келесі ақпаратты толтырыңыз.',
            },
            fields: {
                sex: {
                    label: 'жынысы',
                    male: 'ер',
                    female: 'әйел',
                    unknown: 'белгісіз',
                },
                timezone: {
                    label: 'уақыт белдеуі',
                },
                language: {
                    label: 'қалаған тіл',
                    en: 'English',
                    kk: 'Qazaq',
                    kk_cyrillic: 'Қазақ',
                    ru: 'Русский',
                },
                nsfw: {
                    label: 'NSFW мазмұны',
                    show: 'көрсету',
                    hide: 'көрсетпеу',
                    warn: 'көрсету алдында бұлдырлау',
                },
                birthday: {
                    label: 'туған күні',
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
        },
    },
    diaryInfo: {
        title: 'Тіркелу',
        form: {
            description: {
                line1: 'Енді күнделік ақпаратын және әдепкі параметрлерді толтырыңыз.',
            },
            fields: {
                name: {
                    label: 'күнделік атауы',
                },
                description: {
                    label: 'қосымша тақырып',
                },
                read_privacy: {
                    label: 'оқи алатындар',
                    registered: 'тіркелген қолданушылар',
                    everyone: 'барлығы',
                    friends: 'достар',
                    nobody: 'тек мен',
                },
                comment_privacy: {
                    label: 'пікір жаза алатындар',
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
        }
    },
    reactions: {
        reaction: {
            anonymous: 'жасырын: '
        },
        add_reaction: {
            search: 'Реакцияларды іздеу...',
            no_reactions: 'Реакциялар табылмады',
            recent: 'Соңғы реакциялар',
            basic: 'Негізгі реакциялар',
        },
    },
    post: {
        form: {
            title: 'Жаңа жазба:',
            fields: {
                title: {
                    label: 'Тақырып:',
                },
                textarea: {
                    buttons: {
                        bold: {
                            tooltip: 'Қалың қаріп',
                        },
                        italic: {
                            tooltip: 'Көлбеу қаріп',
                        },
                        underline: {
                            tooltip: 'Асты сызылған',
                        },
                        strikethrough: {
                            tooltip: 'Сызылған',
                        },
                        expandable: {
                            tooltip: '\'Әрі қарай оқу...\' бөлімін қосу',
                        },
                        link: {
                            tooltip: 'Сілтеме қосу',
                        },
                        image: {
                            tooltip: 'Сурет қосу',
                        },
                        slider: {
                            tooltip: 'Слайдер қосу',
                        },
                        left: {
                            tooltip: 'Сол жақ шетке туралау',
                        },
                        center: {
                            tooltip: 'Ортаға туралау',
                        },
                        right: {
                            tooltip: 'Оң жақ шетке туралау',
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
                        css: {
                            tooltip: 'CSS кластарын қосу',
                        },
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
                send: 'жариялау',
                cancel: 'болдырмау',
                repost: 'қайта жариялау'
            }
        },
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
    styles: {
        title: 'Күнделік стильдері',
        addNew: 'Жаңа стиль қосу',
        addNewStyle: 'Жаңа стиль қосу',
        save: 'Өзгерістерді сақтау',
        cancel: 'Өзгерістерден бас тарту',
        add: 'Қосу',
        name: 'Атауы',
        styleContent: 'CSS стиль мазмұны',
        enabled: 'Қосулы',
        previewImage: 'Алдын ала қарау суреті',
        confirmDelete: 'Бұл стильді жоюға сенімдісіз бе?',
        loadError: 'Стильдерді жүктеу сәтсіз аяқталды',
        updateSuccess: 'Стиль сәтті жаңартылды',
        updateError: 'Стильді жаңарту сәтсіз аяқталды',
        addSuccess: 'Стиль сәтті қосылды',
        addError: 'Стильді қосу сәтсіз аяқталды',
        deleteSuccess: 'Стиль сәтті жойылды',
        deleteError: 'Стильді жою сәтсіз аяқталды',
        saveSuccess: 'Өзгерістер сәтті сақталды',
        saveError: 'Өзгерістерді сақтау сәтсіз аяқталды',
        changesCancelled: 'Өзгерістер болдырылмады',
        requiredFields: 'Атауы және CSS стиль мазмұны міндетті',
        previewUrlApplied: 'Алдын ала қарау суретінің URL мекенжайы сәтті қолданылды'
    }
}
