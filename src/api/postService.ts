export interface CommentView {
    id: string;

    avatar: string;
    authorLogin: string;
    authorNickname: string;

    creationTime: string; // TODO localdatetime
}

export interface PostView {
    id: string;
    uri: string;

    avatar: string;
    authorLogin: string;
    authorNickname: string;

    title: string;
    text: string;
    creationTime: string; // TODO localdatetime

    isPreface: boolean;
    isEncrypted: boolean;

    classes: string;
    tags: Set<string>;

    isCommentable: boolean;
    comments: Array<CommentView>;
}