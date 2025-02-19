import { backendURL } from "@/main";

// Types
type TagPolicy = 'UNION' | 'INTERSECTION';

export interface Reaction {}

export interface ReactionView {
    id: string;
    name: string;
    iconUri: string;
    count: number;
    anonymousCount: number;
    userNicknames: string[];
    userReacted: boolean;
}

export interface CommentView {
    id: string;
    avatar: string;
    authorLogin: string;
    authorNickname: string;
    text: string;
    creationTime: string;
    isReactable: boolean;
    reactions: ReactionView[];
    reactionGroupId: string;
}

export interface PostView {
    id: string;
    uri: string;
    avatar: string;
    authorLogin: string;
    authorNickname: string;
    title: string;
    text: string;
    creationTime: string;
    isPreface: boolean;
    isEncrypted: boolean;
    classes: string;
    tags: string[];
    isReactable: boolean;
    reactions: ReactionView[];
    isCommentable: boolean;
    comments: CommentView[];
    readGroupId: string;
    commentGroupId: string;
    reactionGroupId: string;
    commentReactionGroupId: string;
}

interface PostEditView {
    id: string;
    uri: string;
    avatar: string;
    title: string;
    text: string;
    readGroupId: string;
    commentGroupId: string;
    reactionGroupId: string;
    commentReactionGroupId: string;
    tags: string[];
    classes: string;
    isEncrypted: boolean;
}

interface CommentCreateRequest {
    postId: string;
    avatar: string;
    text: string;
    parentCommentId?: string;
    reactionGroupId: string;
}

interface CommentUpdateRequest {
    id: string;
    postId: string;
    avatar: string;
    text: string;
}

interface SearchPostsParams {
    author?: string;
    diary?: string;
    text?: string;
    tags?: string[];
    tagPolicy?: TagPolicy;
    from?: string;
    to?: string;
    page?: number;
    size?: number;
}

type Result<T> = 
    | { type: 'ok'; data: T }
    | { type: 'error'; message: string };

// Helper function for authenticated requests
async function authenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> {
    const token = localStorage.getItem('jwt');
    if (!token) {
        throw new Error('No authentication token found');
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    return fetch(`${backendURL}${endpoint}`, { ...options, headers });
}

// API Methods

export async function getDiaryPreface(diary: string): Promise<Result<PostView>> {
    try {
        const response = await fetch(`${backendURL}/posts/preface?diary=${encodeURIComponent(diary)}`);
        if (response.ok) {
            const data = await response.json();
            return { type: 'ok', data };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function getPost(login: string, uri: string): Promise<Result<PostView>> {
    try {
        const response = await fetch(
            `${backendURL}/posts?login=${encodeURIComponent(login)}&uri=${encodeURIComponent(uri)}`
        );
        if (response.ok) {
            const data = await response.json();
            return { type: 'ok', data };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function searchPosts(params: SearchPostsParams): Promise<Result<{ content: PostView[] }>> {
    try {
        const queryParams = new URLSearchParams();
        if (params.author) queryParams.set('author', params.author);
        if (params.diary) queryParams.set('diary', params.diary);
        if (params.text) queryParams.set('text', params.text);
        if (params.tags) queryParams.set('tags', params.tags.join(','));
        if (params.tagPolicy) queryParams.set('tagPolicy', params.tagPolicy);
        if (params.from) queryParams.set('from', params.from);
        if (params.to) queryParams.set('to', params.to);
        if (params.page !== undefined) queryParams.set('page', params.page.toString());
        if (params.size !== undefined) queryParams.set('size', params.size.toString());

        const response = await fetch(`${backendURL}/posts/search?${queryParams.toString()}`);
        if (response.ok) {
            const data = await response.json();
            return { type: 'ok', data };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function getAllPosts(page = 0, size = 10): Promise<Result<{ content: PostView[] }>> {
    try {
        const response = await fetch(
            `${backendURL}/posts?page=${page}&size=${size}`
        );
        if (response.ok) {
            const data = await response.json();
            return { type: 'ok', data };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function getDiscussedPosts(page = 0, size = 10): Promise<Result<{ content: PostView[] }>> {
    try {
        const response = await fetch(
            `${backendURL}/posts/discussed?page=${page}&size=${size}`
        );
        if (response.ok) {
            const data = await response.json();
            return { type: 'ok', data };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function getFollowedPosts(page = 0, size = 10): Promise<Result<{ content: PostView[] }>> {
    try {
        const response = await authenticatedRequest(
            `/posts/followed?page=${page}&size=${size}`
        );
        if (response.ok) {
            const data = await response.json();
            return { type: 'ok', data };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function getPostForEditing(id: string): Promise<Result<PostEditView>> {
    try {
        const response = await authenticatedRequest(`/posts?id=${encodeURIComponent(id)}`);
        if (response.ok) {
            const data = await response.json();
            return { type: 'ok', data };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function updatePost(post: PostEditView): Promise<Result<PostView>> {
    try {
        const response = await authenticatedRequest('/posts', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        });

        if (response.ok) {
            const data = await response.json();
            return { type: 'ok', data };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function deletePost(postId: string): Promise<Result<string>> {
    try {
        const response = await authenticatedRequest(`/posts?postId=${encodeURIComponent(postId)}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const message = await response.text();
            return { type: 'ok', data: message };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function addComment(comment: CommentCreateRequest): Promise<Result<CommentView>> {
    try {
        const response = await authenticatedRequest('/posts/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(comment)
        });

        if (response.ok) {
            const data = await response.json();
            return { type: 'ok', data };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function updateComment(comment: CommentUpdateRequest): Promise<Result<CommentView>> {
    try {
        const response = await authenticatedRequest('/posts/comment', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(comment)
        });

        if (response.ok) {
            const data = await response.json();
            return { type: 'ok', data };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}

export async function deleteComment(commentId: string): Promise<Result<string>> {
    try {
        const response = await authenticatedRequest(`/posts/comment?commentId=${encodeURIComponent(commentId)}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const message = await response.text();
            return { type: 'ok', data: message };
        } else {
            const message = await response.text();
            return { type: 'error', message };
        }
    } catch (error) {
        return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
}
