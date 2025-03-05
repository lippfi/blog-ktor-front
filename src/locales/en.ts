export default {
    registration: {
        title: 'Registration',
        form: {
            header: 'Registration',
            fields: {
                login: {
                    label: 'login',
                },
                nickname: {
                    label: 'nickname',
                },
                email: {
                    label: 'email',
                },
                password: {
                    label: 'password',
                },
                password_confirmation: {
                    label: 'password confirmation',
                },
                invite_code: {
                    code_required: 'Invite code required',
                    before_admin: 'Get one from a member or contact ',
                    admin: 'admin',
                    after_admin: '.',
                    label: 'invite code'
                },
            },
            button: {
                label: 'register',
            },
            errors: {
                login_required: 'Login is required',
                login_too_long: 'Login is too long',
                login_exists: 'Login already exists',
                nickname_required: 'Nickname is required',
                nickname_too_long: 'Nickname is too long',
                nickname_exists: 'Nickname already exists',
                email_required: 'Email is required',
                email_invalid: 'Email is invalid',
                email_exists: 'Email already exists',
                email_too_long: 'Email is too long',
                password_required: 'Password is required',
                password_confirmation_required: 'Password confirmation is required',
                passwords_mismatch: 'Passwords mismatch',
                invite_code_required: 'Invite code is required',
            },
            exceptions: {
                email_exists: 'Email already exists',
                nickname_exists: 'Nickname already exists',
                login_exists: 'Login already exists',
                invalid_invite_code: 'Invalid invite code',
                unknown: 'Unknown error. Try again later or contact admin',
            },
        },
    },
    login: {
        title: 'Login',
        form: {
            header: 'Welcome',
            fields: {
                login: {
                    label: 'login',
                },
                password: {
                    label: 'password',
                },
            },
            button: {
                label: 'login',
            },
            errors: {
                login_required: 'Login is required',
                password_required: 'Password is required',
            },
            exceptions: {
                invalid_credentials: 'Invalid credentials',
            },
        },
    },
    additionalInfo: {
        title: 'Registration',
        form: {
            description: {
                line1: 'You are registered now.',
                line2: 'Please fill in the following info to to complete your profile.',
            },
            fields: {
                sex: {
                    label: 'gender',
                    male: 'male',
                    female: 'female',
                    unknown: 'unknown',
                },
                timezone: {
                    label: 'timezone',
                },
                language: {
                    label: 'preferred language',
                    en: 'English',
                    kk: 'Qazaq',
                    kk_cyrillic: 'Қазақ',
                    ru: 'Русский',
                },
                nsfw: {
                    label: 'NSFW policy',
                    show: 'show',
                    hide: 'do not show',
                    warn: 'blur before showing',
                },
                birthday: {
                    label: 'birth date',
                },
            },
            buttons: {
                send: {
                    label: 'send',
                },
                skip: {
                    label: 'skip',
                },
            },
        }
    },
    diaryInfo: {
        title: 'Registration',
        form: {
            description: {
                line1: 'Now fill in you diary info and defaults.',
            },
            fields: {
                name: {
                    label: 'diary name',
                },
                description: {
                    label: 'subtitle',
                },
                read_privacy: {
                    label: 'allowed to read',
                    registered: 'registered users',
                    everyone: 'everyone',
                    friends: 'friends',
                    nobody: 'only me',
                },
                comment_privacy: {
                    label: 'allowed to comment',
                    registered: 'registered users',
                    everyone: 'everyone',
                    friends: 'friends',
                    nobody: 'only me',
                },
            },
            buttons: {
                send: {
                    label: 'send',
                },
                skip: {
                    label: 'skip',
                },
            },
        }
    },
    reactions: {
        reaction: {
            anonymous: 'anonymous: '
        },
        add_reaction: {
            search: 'Search reactions...',
            no_reactions: 'No reactions found',
            recent: 'Recent reactions',
            basic: 'Basic reactions',
        },
    },
    post: {
        form: {
            title: 'New post:',
            fields: {
                title: {
                    label: 'Title:',
                },
                textarea: {
                    buttons: {
                        bold: {
                            tooltip: 'Bold text',
                        },
                        italic: {
                            tooltip: 'Italic text',
                        },
                        underline: {
                            tooltip: 'Underline text',
                        },
                        strikethrough: {
                            tooltip: 'Strikethrough text',
                        },
                        expandable: {
                            tooltip: 'Add \'Read more..\' section',
                        },
                        link: {
                            tooltip: 'Insert link',
                        },
                        image: {
                            tooltip: 'Insert image',
                        },
                        slider: {
                            tooltip: 'Insert slider',
                        },
                        left: {
                            tooltip: 'Align text to the left',
                        },
                        center: {
                            tooltip: 'Align text to the center',
                        },
                        right: {
                            tooltip: 'Align text to the right',
                        },
                        bigger: {
                            tooltip: 'Increase text size',
                        },
                        smaller: {
                            tooltip: 'Decrease text size',
                        },
                        gothic: {
                            tooltip: 'Gothic font',
                        },
                        code: {
                            tooltip: 'Insert code block',
                        },
                        css: {
                            tooltip: 'Add custom CSS classes',
                        },
                        mention: {
                            placeholder: 'Search users...',
                        },
                    },
                },
                tags: {
                    label: 'tags:',
                },
                classes: {
                    label: 'html classes:',
                },
                read: {
                    label: 'read:',
                },
                comment: {
                    label: 'comment:',
                },
                react: {
                    label: 'react:',
                },
                advanced: {
                    label: 'advanced options',
                },
            },
            button: {
                send: 'publish'
            }
        },
        view: {
            footer: {
                buttons: {
                    delete: {
                        question: 'Are you sure you want to delete this post?',
                        confirm: 'Delete',
                        cancel: 'Cancel',
                    }
                }
            }
        }
    },
    comment: {
        form: {
            button: {
                send: 'add comment',
            },
        },
        view: {
            footer: {
                buttons: {
                    delete: {
                        question: 'Are you sure you want to delete this comment?',
                        confirm: 'Delete',
                        cancel: 'Cancel',
                    }
                }
            }
        }
    },
    groups: {
        basic: {
            everyone: {
                label: 'everyone',
            },
            registered: {
                label: 'registered users',
            },
            friends: {
                label: 'friends',
            },
            nobody: {
                label: 'only me',
            },
        }
    },
    menu: {
        home: 'Home',
        profile: 'Profile',
        diary: 'Diary',
        messages: 'Messages',
        search: 'Search',
        designOff: 'Turn off design',
        settings: 'Settings',
        logout: 'Logout',
    }
}
