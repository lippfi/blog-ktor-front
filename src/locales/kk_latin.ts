export default {
    registration: {
        title: 'Tirkelu',
        form: {
            header: 'Tirkelu',
            fields: {
                login: {
                    label: 'login',
                },
                nickname: {
                    label: 'laqap at',
                },
                email: {
                    label: 'email',
                },
                password: {
                    label: 'qupiya soz',
                },
                password_confirmation: {
                    label: 'qupiya sozdi rastau',
                },
                invite_code: {
                    code_required: 'Shaqyru kody qajet',
                    before_admin: 'Musheden alynyz nemese ',
                    admin: 'akimshimen',
                    after_admin: ' baylanysynyz.',
                    label: 'shaqyru kody'
                },
            },
            button: {
                label: 'tirkelu',
            },
            errors: {
                login_required: 'Login qajet',
                login_too_long: 'Login tym uzyn',
                login_exists: 'Login bos emes',
                nickname_required: 'Laqap at qajet',
                nickname_too_long: 'Laqap at tym uzyn',
                nickname_exists: 'Laqap at bos emes',
                email_required: 'Email qajet',
                email_invalid: 'Email qate',
                email_exists: 'Email bos emes',
                email_too_long: 'Email tym uzyn',
                password_required: 'Qupiya soz qajet',
                password_confirmation_required: 'Qupiya sozdi rastau qajet',
                passwords_mismatch: 'Qupiya sozder saykes emes',
                invite_code_required: 'Shaqyru kody qajet',
            },
            exceptions: {
                email_exists: 'Email bos emes',
                nickname_exists: 'Laqap at bos emes',
                login_exists: 'Login bos emes',
                invalid_invite_code: 'Shaqyru kody qate',
                unknown: 'Belgisiz qate. Keyinirek qaytalanyz nemese akimshimen baylanysynyz',
            },
        },
    },
    login: {
        title: 'Kiru',
        form: {
            header: 'Qosh keldiniz',
            fields: {
                login: {
                    label: 'login',
                },
                password: {
                    label: 'qupiya soz',
                },
            },
            button: {
                label: 'kiru',
            },
            errors: {
                login_required: 'Login qajet',
                password_required: 'Qupiya soz qajet',
            },
            exceptions: {
                invalid_credentials: 'Login nemese qupiya soz qate',
            },
        },
    },
    additionalInfo: {
        title: 'Tirkelu',
        form: {
            description: {
                line1: 'Siz tirkeldiniz.',
                line2: 'Profilinizdi tolyqtyru ushin kelesi aqparatty toltyrynyz.',
            },
            fields: {
                sex: {
                    label: 'jynysy',
                    male: 'er',
                    female: 'ayel',
                    unknown: 'belgisiz',
                },
                timezone: {
                    label: 'uaqyt beldeui',
                },
                language: {
                    label: 'qalagan til',
                    en: 'English',
                    kk: 'Qazaq',
                    kk_cyrillic: 'Қазақ',
                    ru: 'Русский',
                },
                nsfw: {
                    label: 'NSFW mazmuny',
                    show: 'korsetu',
                    hide: 'korsetpeu',
                    warn: 'korsetu aldynda buldyrlau',
                },
                birthday: {
                    label: 'tugan kuni',
                },
            },
            buttons: {
                send: {
                    label: 'jiberu',
                },
                skip: {
                    label: 'otkirip jiberu',
                },
            },
        },
    },
    diaryInfo: {
        title: 'Tirkelu',
        form: {
            description: {
                line1: 'Endi kundelik aqparatyn jane adepki parametrlerdi toltyrynyz.',
            },
            fields: {
                name: {
                    label: 'kundelik atauy',
                },
                description: {
                    label: 'qosymsha taqyryp',
                },
                read_privacy: {
                    label: 'oqi alatyndar',
                    registered: 'tirkelgen qoldanushylar',
                    everyone: 'barlygy',
                    friends: 'dostar',
                    nobody: 'tek men',
                },
                comment_privacy: {
                    label: 'pikir jaza alatyndar',
                    registered: 'tirkelgen qoldanushylar',
                    everyone: 'barlygy',
                    friends: 'dostar',
                    nobody: 'tek men',
                },
            },
            buttons: {
                send: {
                    label: 'jiberu',
                },
                skip: {
                    label: 'otkirip jiberu',
                },
            },
        }
    },
    reactions: {
        reaction: {
            anonymous: 'jasyryn: '
        },
        add_reaction: {
            search: 'Reaktsiyalardy izdeu...',
            no_reactions: 'Reaktsiyalar tabylmady',
            recent: 'Songy reaktsiyalar',
            basic: 'Negizgi reaktsiyalar',
        },
    },
    post: {
        form: {
            title: 'Jana jazba:',
            fields: {
                title: {
                    label: 'Taqyryp:',
                },
                textarea: {
                    buttons: {
                        bold: {
                            tooltip: 'Qalyn qarip',
                        },
                        italic: {
                            tooltip: 'Kolbeu qarip',
                        },
                        underline: {
                            tooltip: 'Asty syzylgan',
                        },
                        strikethrough: {
                            tooltip: 'Syzylgan',
                        },
                        expandable: {
                            tooltip: '\'Ari qaray oqu...\' bolimin qosu',
                        },
                        link: {
                            tooltip: 'Silteme qosu',
                        },
                        image: {
                            tooltip: 'Suret qosu',
                        },
                        slider: {
                            tooltip: 'Slayder qosu',
                        },
                        left: {
                            tooltip: 'Sol jaq shetke turalau',
                        },
                        center: {
                            tooltip: 'Ortaga turalau',
                        },
                        right: {
                            tooltip: 'On jaq shetke turalau',
                        },
                        bigger: {
                            tooltip: 'Matin olshemin ulkeytu',
                        },
                        smaller: {
                            tooltip: 'Matin olshemin kishireytu',
                        },
                        gothic: {
                            tooltip: 'Gotikalyq qarip',
                        },
                        css: {
                            tooltip: 'CSS klastarin qosu',
                        },
                    },
                },
                tags: {
                    label: 'tegter:',
                },
                classes: {
                    label: 'html klastary:',
                },
                read: {
                    label: 'oqu:',
                },
                comment: {
                    label: 'pikir:',
                },
                react: {
                    label: 'reaktsiya:',
                },
                advanced: {
                    label: 'qosymsha parametrler',
                },
            },
            button: {
                send: 'jariyalau',
                cancel: 'boldyrmau',
                repost: 'qayta jariyalau'
            }
        },
    },
    groups: {
        basic: {
            everyone: {
                label: 'barlygy',
            },
            registered: {
                label: 'tirkelgen qoldanushylar',
            },
            friends: {
                label: 'dostar',
            },
            nobody: {
                label: 'tek men',
            },
        }
    }
}
