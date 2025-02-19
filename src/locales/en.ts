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
        title: 'Additional info',
        form: {
            header: 'Additional info',
            fields: {
                sex: {
                    label: 'sex',
                    male: 'male',
                    female: 'female',
                    unknown: 'unknown',
                },
                timezone: {
                    label: 'timezone',
                },
                language: {
                    label: 'language',
                    en: 'English',
                    kk: 'Qazaq',
                    kk_cyrillic: 'Қазақ',
                    ru: 'Русский',
                },
                nsfw: {
                    label: 'nsfw',
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
    }
}