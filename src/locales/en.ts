export default {
    search: {
        title: 'Search',
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
        },
        noPostsFound: 'No posts found'
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
            validation: {
                sex: {
                    required: 'Gender is required',
                    invalid: 'Invalid gender value',
                },
                nsfw: {
                    required: 'NSFW policy is required',
                    invalid: 'Invalid NSFW policy value',
                },
                language: {
                    required: 'Language is required',
                    invalid: 'Invalid language value',
                },
                timezone: {
                    required: 'Timezone is required',
                },
                birthday: {
                    required: 'Birth date is required',
                    invalid: 'Invalid date',
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
            validation: {
                name: {
                    required: 'Diary name is required',
                },
                description: {
                    required: 'Subtitle is required',
                },
                read: {
                    required: 'Read privacy is required',
                },
                comment: {
                    required: 'Comment privacy is required',
                },
                react: {
                    required: 'Reaction privacy is required',
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
        error: {
            'failed-to-load-basic': 'Failed to load basic reactions',
            'failed-to-load-recent': 'Failed to load recent reactions'
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
                repostTemplate: 'Repost:',
                repostCommentTemplate: 'Repost comment'
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
                            default_text: 'link description',
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
                send: 'send',
                cancel: 'cancel',
                repost: 'repost',
                update: 'update',
            }
        },
        repost: {
            from: 'Reposted from',
        },
        view: {
            subscribe: 'subscribe',
            subscribed: 'subscribed',
            footer: {
                buttons: {
                    delete: {
                        question: 'Are you sure you want to delete this post?',
                        confirm: 'Delete',
                        cancel: 'Cancel',
                    },
                }
            }
        }
    },
    comment: {
        form: {
            title: 'Comment post:',
            button: {
                send: 'add comment',
                cancel: 'cancel',
                apply: 'apply',
                reply: 'reply',
                'cancel-reply': 'cancel',
                'quote': 'Quote'
            },
            'replying-to': 'Replying to',
            'show-preview': 'Show comment',
            'hide-preview': 'Hide comment'
        },
        view: {
            footer: {
                buttons: {
                    delete: {
                        question: 'Are you sure you want to delete this comment?',
                        confirm: 'Delete',
                        cancel: 'Cancel',
                    },
                    reply: {
                        text: 'reply',
                    },
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
                labelInfo: 'Friend label indicates how you categorize a person in your friend list. This label is visible to other users who view your friends. It can describe the relationship, such as significant other, gaming partner, etc.',
                message: 'Message (optional)',
                cancel: 'Cancel',
                confirm: 'Add Friend'
            },
            block: {
                title: 'Block User',
                message: 'Are you sure that you want to block {nickname}?',
                warning: 'You will not be able to see their posts and it will be impossible to undo this action in the next 7 days.',
                reasonPlaceholder: 'Blocking reason',
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
        discussions: 'Discussions',
        profile: 'Profile',
        friends: 'Friends',
        diary: 'Diary',
        messages: 'Messages',
        search: 'Search',
        darkTheme: 'Dark theme',
        lightTheme: 'Light theme',
        designOff: 'Turn off design',
        settings: 'Settings',
        logout: 'Logout',
        collapse: 'Collapse',
    },
    feed: {
        title: 'Feed',
        latest: 'Latest',
        popular: 'Popular',
        following: 'Following',
        friends: 'Friends'
    },
    avatars: {
        noAvatarsAvailable: 'No avatars available',
        loading: 'Loading avatars...',
        save: 'Save',
        cancel: 'Cancel',
        changesSaved: 'Avatar order saved successfully',
        addAvatar: 'Add avatar',
        uploadSuccess: 'Avatar(s) uploaded successfully',
        alreadyAdded: 'Avatar added',
        addToCollection: 'Add to my collection',
        adding: 'Adding...',
        added: 'Added successfully',
        cropTitle: 'Crop image',
        cropConfirm: 'Crop',
    },
    errors: {
        failedToLoadAvatars: 'Failed to load avatars',
        failedToReorderAvatars: 'Failed to reorder avatars',
        failedToUploadAvatars: 'Failed to upload avatars',
        not_found: 'Page or post not found'
    },
    buttons: {
        go_home: 'Go to home page',
        go_back: 'Go back'
    },
    settings: {
        title: 'Settings',
        search: {
            placeholder: 'Search settings...',
        },
        notYetImplemented: 'Not yet implemented',
        categories: {
            user: {
                title: 'User',
                triggers: {
                    account: 'account',
                    profile: 'profile',
                    userSettings: 'user settings',
                },
                items: {
                    nickname: {
                        title: 'Nickname',
                        triggers: {
                            username: 'username',
                            changeUsername: 'change username',
                            changeNickname: 'change nickname',
                        },
                    },
                    signature: {
                        title: 'Signature',
                        triggers: {
                            bio: 'bio',
                            status: 'status',
                        },
                    },
                    timezone: {
                        title: 'Timezone',
                        triggers: {
                            time: 'time',
                            zone: 'zone',
                            clock: 'clock',
                        },
                    },
                    inviteCode: {
                        title: 'Invite Code',
                        triggers: {
                            invite: 'invite',
                            code: 'code',
                            invitation: 'invitation',
                        },
                    },
                    language: {
                        title: 'Language',
                        triggers: {
                            language: 'language',
                            locale: 'locale',
                            changeLanguage: 'change language',
                        },
                    },
                    ignoreList: {
                        title: 'Ignore List',
                        triggers: {
                            ignore: 'ignore',
                            block: 'block',
                            blockedUsers: 'blocked users',
                        },
                    },
                    hiddenUsers: {
                        title: 'Hidden Users',
                        triggers: {
                            hide: 'hide',
                            hidden: 'hidden',
                            muteUsers: 'mute users',
                        },
                    },
                },
            },
            diary: {
                title: 'Diary',
                triggers: {
                    blog: 'blog',
                    journal: 'journal',
                },
                items: {
                    diaryTitle: {
                        title: 'Diary Title',
                        triggers: {
                            blogName: 'blog name',
                            diaryName: 'diary name',
                        },
                    },
                    preface: {
                        title: 'Preface',
                        triggers: {
                            intro: 'intro',
                            description: 'description',
                        },
                    },
                    defaultGroups: {
                        title: 'Default Groups',
                        triggers: {
                            default: 'default',
                            autoAssign: 'auto assign',
                        },
                    },
                    manageGroups: {
                        title: 'Manage Groups',
                        triggers: {
                            manage: 'manage',
                            groups: 'groups',
                            memberGroups: 'member groups',
                        },
                    },
                    hiddenPosts: {
                        title: 'Hidden Posts',
                        triggers: {
                            hidden: 'hidden',
                            private: 'private',
                            visibility: 'visibility',
                        },
                    },
                    deletedPosts: {
                        title: 'Deleted Posts',
                        triggers: {
                            deleted: 'deleted',
                            trash: 'trash',
                            removed: 'removed',
                        },
                    },
                },
            },
            avatars: {
                title: 'Avatars',
                triggers: {
                    avatar: 'avatar',
                    profilePicture: 'profile picture',
                    photo: 'photo',
                },
                items: {
                    avatars: {
                        title: 'Avatars',
                        triggers: {
                            manage: 'manage',
                            upload: 'upload',
                        },
                    },
                },
            },
            reactions: {
                title: 'Reactions',
                triggers: {
                    emoji: 'emoji',
                    react: 'react',
                },
                items: {
                    createReactionPack: {
                        title: 'Create Reaction Pack',
                        triggers: {
                            create: 'create',
                            newPack: 'new pack',
                        },
                    },
                    myReactionPacks: {
                        title: 'My Reaction Packs',
                        triggers: {
                            packs: 'packs',
                            manage: 'manage',
                        },
                    },
                },
            },
            notifications: {
                title: 'Notifications',
                triggers: {
                    alerts: 'alerts',
                    notify: 'notify',
                },
                items: {
                    onsiteNotifications: {
                        title: 'On-site Notifications',
                        triggers: {
                            onsite: 'on-site',
                            web: 'web',
                        },
                    },
                    emailNotifications: {
                        title: 'Email Notifications',
                        triggers: {
                            email: 'email',
                            mail: 'mail',
                        },
                    },
                },
            },
            security: {
                title: 'Security',
                triggers: {
                    safety: 'safety',
                    protection: 'protection',
                },
                items: {
                    password: {
                        title: 'Password',
                        triggers: {
                            changePassword: 'change password',
                            resetPassword: 'reset password',
                        },
                    },
                    emailAddress: {
                        title: 'Email Address',
                        triggers: {
                            changeEmail: 'change email',
                            email: 'email',
                        },
                    },
                    activeSessions: {
                        title: 'Active Sessions',
                        triggers: {
                            sessions: 'sessions',
                            devices: 'devices',
                            loggedIn: 'logged in',
                        },
                    },
                    twoFactorAuth: {
                        title: 'Two-Factor Authentication',
                        triggers: {
                            twoFactor: 'two-factor',
                            totp: 'totp',
                            authenticator: 'authenticator',
                        },
                    },
                },
            },
            preferences: {
                title: 'Preferences',
                triggers: {
                    customize: 'customize',
                    options: 'options',
                },
                items: {
                    appearance: {
                        title: 'Appearance',
                        triggers: {
                            theme: 'theme',
                            darkMode: 'dark mode',
                            look: 'look',
                        },
                    },
                    accessibility: {
                        title: 'Accessibility',
                        triggers: {
                            a11y: 'a11y',
                            screenReader: 'screen reader',
                        },
                    },
                    layout: {
                        title: 'Layout',
                        triggers: {
                            columns: 'columns',
                            arrangement: 'arrangement',
                        },
                    },
                },
            },
        },
    },
    nicknameSettings: {
        placeholder: 'Enter your nickname',
        save: 'Save',
        cancel: 'Cancel',
        saveSuccess: 'Nickname updated successfully',
        saveError: 'Failed to update nickname',
        loadError: 'Failed to load nickname',
        errors: {
            required: 'Nickname is required',
            tooLong: 'Nickname is too long',
            alreadyExists: 'Nickname already exists',
        },
    },
    signatureSettings: {
        placeholder: 'Enter your signature',
        save: 'Save',
        cancel: 'Cancel',
        saveSuccess: 'Signature updated successfully',
        saveError: 'Failed to update signature',
        loadError: 'Failed to load signature',
        errors: {
            tooLong: 'Signature is too long (max 200 characters)',
        },
    },
    languageSettings: {
        placeholder: 'Select language',
        save: 'Save',
        cancel: 'Cancel',
        saveSuccess: 'Language updated successfully',
        saveError: 'Failed to update language',
        loadError: 'Failed to load language',
    },
    timezoneSettings: {
        placeholder: 'Select timezone',
        save: 'Save',
        cancel: 'Cancel',
        saveSuccess: 'Timezone updated successfully',
        saveError: 'Failed to update timezone',
        loadError: 'Failed to load timezone',
    },
    onsiteNotificationSettings: {
        loadError: 'Failed to load notification settings',
        saveError: 'Failed to update notification settings',
        save: 'Save',
        cancel: 'Cancel',
        notifyAboutComments: 'Comments on my posts',
        notifyAboutReplies: 'Replies to my comments',
        notifyAboutPostReactions: 'Reactions to my posts',
        notifyAboutCommentReactions: 'Reactions to my comments',
        notifyAboutPrivateMessages: 'Private messages',
        notifyAboutMentions: 'Mentions in posts',
        notifyAboutNewPosts: 'New posts from subscriptions',
        notifyAboutFriendRequests: 'Friend requests',
        notifyAboutReposts: 'Reposts',
        notifyAboutCommentMentions: 'Mentions in comments',
    },
    styles: {
        preview: {
            save: 'Add to my collection',
            alreadyAdded: 'Style added',
            goToCollection: 'Go to style collection',
        },
        form: {
            title: {
                add: 'Add new style',
                edit: 'Edit style',
            },
            name: {
                placeholder: 'enter style name',
            },
            description: {
                placeholder: 'enter style description',
            },
            css: {
                placeholder: 'enter CSS style content',
            },
            button: {
                add: 'add style',
                update: 'update style',
                cancel: 'cancel',
            }
        },
        footer: {
            delete: {
                confirmation: 'Are you sure you want to delete this style?',
            },
        },
        reorder: {
            button: {
                save: 'save order',
                cancel: 'cancel',
            },
        },
        title: 'Diary Styles',
        addNew: 'Add New Style',
        addNewStyle: 'Add New Style',
        save: 'Save Changes',
        cancel: 'Cancel Changes',
        add: 'add style',
        name: 'Name',
        styleContent: 'CSS Style Content',
        enabled: 'Enabled',
        previewImage: 'Preview Image',
        confirmDelete: 'Are you sure you want to delete this style?',
        loadError: 'Failed to load styles',
        updateSuccess: 'Style updated successfully',
        updateError: 'Failed to update style',
        addSuccess: 'Style added successfully',
        addError: 'Failed to add style',
        deleteSuccess: 'Style deleted successfully',
        deleteError: 'Failed to delete style',
        saveSuccess: 'Changes saved successfully',
        saveError: 'Failed to save changes',
        changesCancelled: 'Changes cancelled',
        requiredFields: 'Name and CSS Style Content are required',
        previewUrlApplied: 'Preview image URL applied successfully'
    },
    ignoreListSettings: {
        empty: 'Your ignore list is empty.',
        loading: 'Loading...',
        loadError: 'Failed to load ignore list.',
        confirmTitle: 'Unignore User',
        confirmUnignore: 'Are you sure you want to unignore {nickname}?',
        confirm: 'Unignore',
        cancel: 'Cancel',
        unignoreSuccess: '{nickname} has been removed from your ignore list.',
    },
    hiddenUsersSettings: {
        loading: 'Loading...',
        loadError: 'Failed to load hidden users list.',
        empty: 'Your hidden users list is empty.',
        confirmTitle: 'Unhide User',
        confirmUnhide: 'Are you sure you want to unhide {nickname}?',
        confirm: 'Unhide',
        cancel: 'Cancel',
        unhideSuccess: '{nickname} has been removed from your hidden users list.',
    },
    diaryTitleSettings: {
        titlePlaceholder: 'Diary title',
        subtitlePlaceholder: 'Diary subtitle',
        save: 'Save',
        cancel: 'Cancel',
        saveSuccess: 'Diary title updated successfully',
        saveError: 'Failed to update diary title',
        loadError: 'Failed to load diary title',
    },
    headerNotifications: {
        title: 'Notifications',
        noNotifications: 'No notifications',
    },
    notificationTypes: {
        COMMENT: 'New comment',
        NEW_POST: 'New post',
        COMMENT_REPLY: 'Reply to comment',
        POST_REACTION: 'Post reaction',
        COMMENT_REACTION: 'Comment reaction',
        POST_MENTION: 'Mentioned in post',
        COMMENT_MENTION: 'Mentioned in comment',
        PRIVATE_MESSAGE: 'Private message',
        FRIEND_REQUEST: 'Friend request',
        REPOST: 'Repost',
        COMMENT_REPOST: 'Comment repost',
    },
    notificationItem: {
        markAsRead: 'Mark as read',
        from: 'From {user}',
        friendRequestText: '{nickname} sent you a friend request',
        friendRequestAccept: 'Add friend',
        friendRequestDecline: 'Decline',
        friendRequestAcceptSuccess: 'Friend request accepted',
        friendRequestAcceptError: 'Failed to accept friend request',
        friendRequestDeclineSuccess: 'Friend request declined',
        friendRequestDeclineError: 'Failed to decline friend request',
        viewPost: 'View post',
        openChat: 'Open chat',
        timeJustNow: 'Just now',
        timeMinutesAgo: '{n} min ago',
        timeHoursAgo: '{n} h ago',
        timeYesterday: 'Yesterday',
        postReactionText: '{nickname} added reaction {reaction} to your post: {post}',
        commentReactionText: '{nickname} added reaction {reaction} to your comment in post: {post}',
        commentText: '{nickname} commented on your post: {post}',
        commentReplyText: '{nickname} replied to your comment in post: {post}',
        repostText: '{nickname} reposted your post: {post}',
        commentRepostText: '{nickname} reposted your comment in post: {post}',
        postMentionText: '{nickname} mentioned you in post: {post}',
        commentMentionText: '{nickname} mentioned you in comment on post: {post}',
    },
}
