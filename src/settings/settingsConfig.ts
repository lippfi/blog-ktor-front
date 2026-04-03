import { inviteCodeRequired } from '@/constants'

export type SettingsItem = {
  id: string
  titleKey: string
  triggers: string[]
}

export type SettingsCategory = {
  id: string
  titleKey: string
  triggers: string[]
  items: SettingsItem[]
}

const inviteCodeItem: SettingsItem = {
  id: 'inviteCode',
  titleKey: 'settings.categories.user.items.inviteCode.title',
  triggers: [
    'settings.categories.user.items.inviteCode.triggers.invite',
    'settings.categories.user.items.inviteCode.triggers.code',
    'settings.categories.user.items.inviteCode.triggers.invitation',
  ],
}

export const settingsCategories: SettingsCategory[] = [
  {
    id: 'user',
    titleKey: 'settings.categories.user.title',
    triggers: [
      'settings.categories.user.triggers.account',
      'settings.categories.user.triggers.profile',
      'settings.categories.user.triggers.userSettings',
    ],
    items: [
      {
        id: 'nickname',
        titleKey: 'settings.categories.user.items.nickname.title',
        triggers: [
          'settings.categories.user.items.nickname.triggers.username',
          'settings.categories.user.items.nickname.triggers.changeUsername',
          'settings.categories.user.items.nickname.triggers.changeNickname',
        ],
      },
      {
        id: 'signature',
        titleKey: 'settings.categories.user.items.signature.title',
        triggers: [
          'settings.categories.user.items.signature.triggers.bio',
          'settings.categories.user.items.signature.triggers.status',
        ],
      },
      {
        id: 'timezone',
        titleKey: 'settings.categories.user.items.timezone.title',
        triggers: [
          'settings.categories.user.items.timezone.triggers.time',
          'settings.categories.user.items.timezone.triggers.zone',
          'settings.categories.user.items.timezone.triggers.clock',
        ],
      },
      ...(inviteCodeRequired ? [inviteCodeItem] : []),
      {
        id: 'language',
        titleKey: 'settings.categories.user.items.language.title',
        triggers: [
          'settings.categories.user.items.language.triggers.language',
          'settings.categories.user.items.language.triggers.locale',
          'settings.categories.user.items.language.triggers.changeLanguage',
        ],
      },
      {
        id: 'ignoreList',
        titleKey: 'settings.categories.user.items.ignoreList.title',
        triggers: [
          'settings.categories.user.items.ignoreList.triggers.ignore',
          'settings.categories.user.items.ignoreList.triggers.block',
          'settings.categories.user.items.ignoreList.triggers.blockedUsers',
        ],
      },
      {
        id: 'hiddenUsers',
        titleKey: 'settings.categories.user.items.hiddenUsers.title',
        triggers: [
          'settings.categories.user.items.hiddenUsers.triggers.hide',
          'settings.categories.user.items.hiddenUsers.triggers.hidden',
          'settings.categories.user.items.hiddenUsers.triggers.muteUsers',
        ],
      },
    ],
  },
  {
    id: 'diary',
    titleKey: 'settings.categories.diary.title',
    triggers: [
      'settings.categories.diary.triggers.blog',
      'settings.categories.diary.triggers.journal',
    ],
    items: [
      {
        id: 'diaryTitle',
        titleKey: 'settings.categories.diary.items.diaryTitle.title',
        triggers: [
          'settings.categories.diary.items.diaryTitle.triggers.blogName',
          'settings.categories.diary.items.diaryTitle.triggers.diaryName',
        ],
      },
      {
        id: 'preface',
        titleKey: 'settings.categories.diary.items.preface.title',
        triggers: [
          'settings.categories.diary.items.preface.triggers.intro',
          'settings.categories.diary.items.preface.triggers.description',
        ],
      },
      {
        id: 'manageGroups',
        titleKey: 'settings.categories.diary.items.manageGroups.title',
        triggers: [
          'settings.categories.diary.items.manageGroups.triggers.manage',
          'settings.categories.diary.items.manageGroups.triggers.groups',
          'settings.categories.diary.items.manageGroups.triggers.memberGroups',
        ],
      },
      {
        id: 'defaultGroups',
        titleKey: 'settings.categories.diary.items.defaultGroups.title',
        triggers: [
          'settings.categories.diary.items.defaultGroups.triggers.default',
          'settings.categories.diary.items.defaultGroups.triggers.autoAssign',
        ],
      },
      {
        id: 'hiddenPosts',
        titleKey: 'settings.categories.diary.items.hiddenPosts.title',
        triggers: [
          'settings.categories.diary.items.hiddenPosts.triggers.hidden',
          'settings.categories.diary.items.hiddenPosts.triggers.private',
          'settings.categories.diary.items.hiddenPosts.triggers.visibility',
        ],
      },
    ],
  },
  {
    id: 'avatars',
    titleKey: 'settings.categories.avatars.title',
    triggers: [
      'settings.categories.avatars.triggers.avatar',
      'settings.categories.avatars.triggers.profilePicture',
      'settings.categories.avatars.triggers.photo',
    ],
    items: [
      {
        id: 'avatars',
        titleKey: 'settings.categories.avatars.items.avatars.title',
        triggers: [
          'settings.categories.avatars.items.avatars.triggers.manage',
          'settings.categories.avatars.items.avatars.triggers.upload',
        ],
      },
    ],
  },
  {
    id: 'reactions',
    titleKey: 'settings.categories.reactions.title',
    triggers: [
      'settings.categories.reactions.triggers.emoji',
      'settings.categories.reactions.triggers.react',
    ],
    items: [
      {
        id: 'createReactionPack',
        titleKey: 'settings.categories.reactions.items.createReactionPack.title',
        triggers: [
          'settings.categories.reactions.items.createReactionPack.triggers.create',
          'settings.categories.reactions.items.createReactionPack.triggers.newPack',
        ],
      },
      {
        id: 'myReactionPacks',
        titleKey: 'settings.categories.reactions.items.myReactionPacks.title',
        triggers: [
          'settings.categories.reactions.items.myReactionPacks.triggers.packs',
          'settings.categories.reactions.items.myReactionPacks.triggers.manage',
        ],
      },
    ],
  },
  {
    id: 'notifications',
    titleKey: 'settings.categories.notifications.title',
    triggers: [
      'settings.categories.notifications.triggers.alerts',
      'settings.categories.notifications.triggers.notify',
    ],
    items: [
      {
        id: 'onsiteNotifications',
        titleKey: 'settings.categories.notifications.items.onsiteNotifications.title',
        triggers: [
          'settings.categories.notifications.items.onsiteNotifications.triggers.onsite',
          'settings.categories.notifications.items.onsiteNotifications.triggers.web',
        ],
      },
      {
        id: 'emailNotifications',
        titleKey: 'settings.categories.notifications.items.emailNotifications.title',
        triggers: [
          'settings.categories.notifications.items.emailNotifications.triggers.email',
          'settings.categories.notifications.items.emailNotifications.triggers.mail',
        ],
      },
    ],
  },
  {
    id: 'security',
    titleKey: 'settings.categories.security.title',
    triggers: [
      'settings.categories.security.triggers.safety',
      'settings.categories.security.triggers.protection',
    ],
    items: [
      {
        id: 'password',
        titleKey: 'settings.categories.security.items.password.title',
        triggers: [
          'settings.categories.security.items.password.triggers.changePassword',
          'settings.categories.security.items.password.triggers.resetPassword',
        ],
      },
      {
        id: 'emailAddress',
        titleKey: 'settings.categories.security.items.emailAddress.title',
        triggers: [
          'settings.categories.security.items.emailAddress.triggers.changeEmail',
          'settings.categories.security.items.emailAddress.triggers.email',
        ],
      },
      {
        id: 'activeSessions',
        titleKey: 'settings.categories.security.items.activeSessions.title',
        triggers: [
          'settings.categories.security.items.activeSessions.triggers.sessions',
          'settings.categories.security.items.activeSessions.triggers.devices',
          'settings.categories.security.items.activeSessions.triggers.loggedIn',
        ],
      },
      {
        id: 'twoFactorAuth',
        titleKey: 'settings.categories.security.items.twoFactorAuth.title',
        triggers: [
          'settings.categories.security.items.twoFactorAuth.triggers.twoFactor',
          'settings.categories.security.items.twoFactorAuth.triggers.totp',
          'settings.categories.security.items.twoFactorAuth.triggers.authenticator',
        ],
      },
    ],
  },
  {
    id: 'preferences',
    titleKey: 'settings.categories.preferences.title',
    triggers: [
      'settings.categories.preferences.triggers.customize',
      'settings.categories.preferences.triggers.options',
    ],
    items: [
      {
        id: 'appearance',
        titleKey: 'settings.categories.preferences.items.appearance.title',
        triggers: [
          'settings.categories.preferences.items.appearance.triggers.theme',
          'settings.categories.preferences.items.appearance.triggers.darkMode',
          'settings.categories.preferences.items.appearance.triggers.look',
        ],
      },
      {
        id: 'accessibility',
        titleKey: 'settings.categories.preferences.items.accessibility.title',
        triggers: [
          'settings.categories.preferences.items.accessibility.triggers.a11y',
          'settings.categories.preferences.items.accessibility.triggers.screenReader',
        ],
      },
      {
        id: 'layout',
        titleKey: 'settings.categories.preferences.items.layout.title',
        triggers: [
          'settings.categories.preferences.items.layout.triggers.columns',
          'settings.categories.preferences.items.layout.triggers.arrangement',
        ],
      },
    ],
  },
]
