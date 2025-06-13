export default {
    search: {
        placeholder: 'Search posts...',
        advanced: {
            label: 'Advanced search',
            tags: {
                label: 'Tags',
                placeholder: 'Enter tags'
            },
            tagPolicy: {
                label: 'Tag matching',
                union: 'any tag (OR)',
                intersection: 'all tags (AND)'
            },
            from: {
                label: 'From date',
                placeholder: 'Select start date'
            },
            to: {
                label: 'To date',
                placeholder: 'Select end date'
            },
            sorting: {
                label: 'Sort by',
                field: {
                    label: 'Field',
                    creationTime: 'Date',
                    title: 'Title'
                },
                order: {
                    label: 'Order',
                    asc: 'oldest first',
                    desc: 'newest first'
                }
            }
        },
        button: {
            search: 'Search',
            clear: 'Clear'
        }
    },
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
    email_confirmation: {
        title: "Email confirmation",
        form: {
            header: "Email confirmation",
            fields: {
                code: {
                    label: "confirmation code",
                },
                message: {
                    line1: "Email confirmation code has been sent to your email.",
                    line2: "Please enter the code to confirm your email.",
                }
            },
            button: {
                label: "confirm",
            }
        }
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
            forgot_password: {
                label: 'forgot password',
            }
        },
    },
    reset: {
        title: 'Reset password',
        form: {
            header: 'Reset password',
            fields: {
                identifier: {
                    label: 'email or login',
                },
                code: {
                    label: 'confirmation code',
                },
                password: {
                    label: 'password',
                },
                password_confirmation: {
                    label: 'password confirmation',
                },
            },
            description: {
                line1: 'Confirmation code has been sent to your email.',
            },
            errors: {
                field_required: 'Field is required',
                password_required: 'Password is required',
                password_confirmation_required: 'Password confirmation is required',
                passwords_mismatch: 'Passwords mismatch',
            },
            button: {
                label: 'next',
            },
            button2: {
                label: 'confirm',
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
                    label: 'confirm',
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
                    label: 'default read privacy',
                    registered: 'registered users',
                    everyone: 'everyone',
                    friends: 'friends',
                    nobody: 'only me',
                },
                comment_privacy: {
                    label: 'default comment privacy',
                    registered: 'registered users',
                    everyone: 'everyone',
                    friends: 'friends',
                    nobody: 'only me',
                },
                react_privacy: {
                    label: 'default reaction privacy',
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
    diaryImport: {
        title: 'Import diary',
        form: {
            description: {
                line1: 'You can import your diary from another website.',
            },
            fields: {
                website: {
                    label: 'website',
                },
                login: {
                    label: 'login',
                },
                password: {
                    label: 'password',
                },
            },
            buttons: {
                send: {
                    label: 'import',
                },
                skip: {
                    label: 'skip',
                },
                continue: {
                    label: 'continue',
                },
            }
        },
        import: {
            title: 'Import in progress..'
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
    avatarChooser: {
      oneTimeAvatar: 'link',
    },
    post: {
        form: {
            title: {
                add: 'New post:',
                edit: 'Edit:',
                repost: 'Repost:',
            },
            fields: {
                title: {
                    label: 'Title:',
                    defaultValue: 'Unnamed',
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
                        quote: {
                            tooltip: 'Quote selected'
                        }
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
                send: 'publish',
                cancel: 'cancel',
                repost: 'repost'
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
                cancel: 'cancel',
                apply: 'apply'
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
    userAvatar: {
        menu: {
            profile: 'Profile',
            diary: 'Diary',
            privateMessage: 'Private message',
            addFriend: 'Add friend',
            removeFriend: 'Remove friend',
            block: 'Block'
        },
        dialog: {
            addFriend: {
                title: 'Add Friend',
                label: 'Friend label (optional)',
                message: 'Message (optional)',
                cancel: 'Cancel',
                confirm: 'Add Friend'
            },
            block: {
                title: 'Block User',
                message: 'Are you sure that you want to block {nickname}?',
                warning: 'You will not be able to see their posts and it will be impossible to undo this action in the next 7 days.',
                hideFromFeed: {
                    suggestion: 'Maybe you want to hide their posts from your feed?',
                    button: 'Hide from feed'
                },
                cancel: 'Cancel',
                confirm: 'Block'
            },
            removeFriend: {
                message: 'Are you sure that you want remove {nickname} from your friend list?',
                title: 'Remove friend',
                confirm: 'Yes',
                cancel: 'No'
            }
        },
        notifications: {
            block: {
                success: 'User {nickname} has been blocked',
                error: 'Failed to block user'
            },
            hideFromFeed: {
                success: 'Posts from {nickname} will be hidden from your feed',
                error: 'Failed to hide posts from feed'
            },
            addFriend: {
                success: 'Friend request sent successfully',
                error: 'Failed to send friend request'
            },
            removeFriend: {
                success: '{nickname} was removed from your friend list',
                error: 'Failed to remove friend'
            }
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
    },
    feed: {
        latest: 'Latest',
        popular: 'Popular',
        following: 'Following'
    },
    avatars: {
        noAvatarsAvailable: 'No avatars available',
        loading: 'Loading avatars...',
        save: 'Save',
        cancel: 'Cancel',
        changesSaved: 'Avatar order saved successfully',
        addAvatar: 'Add avatar',
        uploadSuccess: 'Avatar(s) uploaded successfully'
    },
    errors: {
        failedToLoadAvatars: 'Failed to load avatars',
        failedToReorderAvatars: 'Failed to reorder avatars',
        failedToUploadAvatars: 'Failed to upload avatars'
    }
}
