import type { PostCreateDto } from "@/api/dto/postServiceDto.ts";
import type { Language } from "@/api/userClient.ts";
import { getCurrentSessionInfo } from "@/api/userClient.ts";
import { getBasicAccessGroups } from "@/api/accessGroupService.ts";
import PostClientImpl from "@/api/postClient/postClient.ts";
import { i18n } from "@/i18n.ts";

export const WELCOME_POST_AVATAR = "https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/f821fb24-cc2c-44d6-9c73-dd4e2cc38be4.png";

type WelcomePostContent = {
    title: string;
    text: string;
}

type CreateWelcomePostResult = {
    type: "ok" | "error";
    message?: string;
}

const AVATAR_BLOCK = `[avatars]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/1ebef84a-763e-482d-8999-7d2fccc26651.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/ea60b6c3-9029-415e-b8c7-c5206ef23072.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/37d2391c-90c9-4c1f-a864-d4dbd4316642.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/ecaad8af-e9c8-441b-a4dd-fb28d234bde0.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/10fefce2-d5ce-4e9b-b86f-34b3cd61017f.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/5006d09b-28e3-4da2-964f-dcd75bf117ea.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/d9aeb3d7-5a43-4cdc-89c0-9fa8b80533c1.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/59f2424f-13c0-4688-8954-290dbf0b2e25.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/a2073544-9e86-4604-8508-bccbd77d2fda.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/30734c4c-e1f1-4bc7-80b0-630fb0b3ed52.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/9f91a479-1de8-4516-8316-97eccf12abe2.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/f821fb24-cc2c-44d6-9c73-dd4e2cc38be4.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/d3ceb1f7-b3ee-4cd6-8919-f67e2874aca9.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/3a0db62d-7abf-4820-8935-12250ebdfbac.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/4bc879b5-b668-4237-b8c0-1dfb73ab3f9f.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/6734ddd1-093b-4bff-a725-d52d1b5ce45c.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/bc03bc46-8982-464f-949b-124bd9cab007.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/92cab0b1-a8fc-47fc-a756-e0d4ea1560cb.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/3114b72d-0158-4a7a-bd07-b9494cac258c.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/05132d7a-415b-4876-849d-61cca0822c0f.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/a321f3cb-f755-496c-af69-53505d0af768.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/d59edb8d-1d2a-4499-a8d6-6faec9a6c149.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/8387fec8-6d54-4e44-a993-4090f3a73d8e.png"]
[avatar img="https://lipp.fi/blog-file/u/74bbb266-3e92-4a6e-97ca-571a384c4cbb/avatar/2e0ca494-4c67-4fea-9e6a-fe278f47247b.png"]
[avatar img="https://lipp.fi/blog-file/u/12791740-8302-4310-85f8-2fcde1db6b06/avatar/901f2ed9-3329-4bde-b252-34f275a601a4.png"]
[avatar img="https://lipp.fi/blog-file/u/12791740-8302-4310-85f8-2fcde1db6b06/avatar/f97f318c-44db-49f2-96a4-f0dfbe476003.jpg"]
[avatar img="https://lipp.fi/blog-file/u/12791740-8302-4310-85f8-2fcde1db6b06/avatar/75703686-2260-4035-a055-35be54ad7264.jpg"]
[avatar img="https://lipp.fi/blog-file/u/12791740-8302-4310-85f8-2fcde1db6b06/avatar/52ae0c76-1a4b-40d9-bba7-569f4b4ce5ab.png"]
[/avatars]`;

const WELCOME_POST_CONTENT_BY_LANGUAGE: Record<Language, WelcomePostContent> = {
    EN: {
        title: "Welcome Post",
        text: `Hi there! Only you can see this post, and you can delete it at any time.

The site has been single-user for a long time and is now running in test mode. Communities, private messages, notifications, and everything else will be added, but not immediately. For now, the main goal is to deploy everything, look for bugs, and make sure everything works as expected.

For now, here is a list of random avatars (thanks to user damanick for them):
${AVATAR_BLOCK}

If you have any questions, write here —
Good luck!`
    },
    RU: {
        title: "Приветственный пост",
        text: `Привет! Только ты видишь этот пост, и можешь удалить его в любой момент.

Сайт долгое время был однопользовательским и сейчас работает в тестовом режиме. Сообщества, личные сообщения, уведомления и всё остальное будут добавлены, но не сразу. Пока главная цель — развернуть всё, найти баги и убедиться, что всё работает как ожидается.

А пока вот список случайных аватаров (спасибо пользователю damanick за них):
${AVATAR_BLOCK}

Если есть вопросы — пиши сюда (место для ссылки).
Удачи!`
    },
    KK: {
        title: "Qosh keldiniz posti",
        text: `Sälem! Bul postty tek siz ğana kore alasız, jäne ony kez kelgen uaqytta oshire alasız.

Sayt uzaq uaqyt boiy bir paidalanuşyly bolyp keldi jäne qazir test rejiminde istep tur. Qauymdastyqtar, jeke habarlar, habarlamalar jäne qalğan nárseniñ bäri qosylady, biraq birden emes. Qazirge negizgi maqsat — bärin engizu, qatelerdi tabu jäne bäriniñ durys jumys isteitinin tekseru.

Ázirge mına kezdeisoq avatarlar tizimi (olar üshin damanick paidalanuşysyna rakhmet):
${AVATAR_BLOCK}

Suraktynyz bolsa — osy zherge jazynyz.
Sát tilеimiz!`
    },
    KK_CYRILLIC: {
        title: "Қош келдіңіз посты",
        text: `Сәлем! Бұл постты тек сіз ғана көре аласыз, және оны кез келген уақытта өшіре аласыз.

Сайт ұзақ уақыт бойы бір пайдаланушылы болып келді және қазір тест режимінде істеп тұр. Қауымдастықтар, жеке хабарлар, хабарламалар және қалған нәрсенің бәрі қосылады, бірақ бірден емес. Қазірге негізгі мақсат — бәрін енгізу, қателерді табу және бәрінің дұрыс жұмыс істейтінін тексеру.

Әзірге мына кездейсоқ аватарлар тізімі (олар үшін damanick пайдаланушысына рахмет):
${AVATAR_BLOCK}

Сұрағыңыз болса — осы жерге жазыңыз.
Сәттілік!`
    }
};

export function getWelcomePostContent(language: Language): WelcomePostContent {
    return WELCOME_POST_CONTENT_BY_LANGUAGE[language] ?? WELCOME_POST_CONTENT_BY_LANGUAGE.EN;
}

export function buildWelcomePostDto(language: Language, privateGroupId: string): PostCreateDto {
    const content = getWelcomePostContent(language);

    return {
        uri: "",
        isPreface: false,
        isEncrypted: false,
        title: content.title,
        text: content.text,
        mentionedLogins: [],
        classes: "",
        tags: [],
        readGroupId: privateGroupId,
        commentGroupId: privateGroupId,
        reactionGroupId: privateGroupId,
        commentReactionGroupId: privateGroupId,
        isHidden: false,
        avatar: WELCOME_POST_AVATAR,
    };
}

export async function createWelcomePostForCurrentSession(): Promise<CreateWelcomePostResult> {
    const sessionInfo = await getCurrentSessionInfo();
    const language: Language = sessionInfo.language ?? "EN";
    return createWelcomePost(language);
}

export async function createWelcomePost(language: Language): Promise<CreateWelcomePostResult> {
    const accessGroups = await getBasicAccessGroups(language);

    if (accessGroups.type !== "ok") {
        return {
            type: "error",
            message: `Failed to load access groups for welcome post: ${accessGroups.message}`,
        };
    }

    const privateGroupName = i18n.global.t("groups.basic.nobody.label", {}, {locale: language}) as string;
    const privateGroupId = accessGroups.data[privateGroupName];

    if (!privateGroupId) {
        return {
            type: "error",
            message: "Private access group is missing, welcome post was not created.",
        };
    }

    const postClient = new PostClientImpl();
    const createPostResult = await postClient.addPost(buildWelcomePostDto(language, privateGroupId));

    if (createPostResult.type !== "ok") {
        return {
            type: "error",
            message: `Failed to create welcome post: ${createPostResult.message}`,
        };
    }

    return {type: "ok"};
}