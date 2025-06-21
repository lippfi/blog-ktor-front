import { backendURL } from "@/main.ts";
import type {
    CommentCreateRequest,
    CommentDto,
    CommentUpdateRequest, PostCreateDto,
    PostViewDto,
    PostEditDto, PostSearchResult,
    SearchPostsParamsDto, DiaryPageDto, PostPageDto
} from "@/api/dto/postServiceDto.ts";
import {authenticatedRequest} from "@/api/userService.ts";

export type Result<T> =
    | { type: 'ok'; data: T }
    | { type: 'error'; message: string };

export interface IPostClient {
    getDiaryPosts(diary: string, page: number): Promise<Result<DiaryPageDto>>;
    getPost(login: string, uri: string): Promise<Result<PostPageDto>>;
    searchDiaryPosts(params: SearchPostsParamsDto): Promise<Result<DiaryPageDto>>;
    getLatestPosts(page?: number): Promise<Result<PostSearchResult>>;
    getDiscussedPosts(page?: number, size?: number): Promise<Result<PostSearchResult>>;
    getFollowedPosts(page?: number, size?: number): Promise<Result<PostSearchResult>>;
    getPostForEditing(id: string): Promise<Result<PostEditDto>>;
    updatePost(post: PostEditDto): Promise<Result<PostViewDto>>;
    deletePost(postId: string): Promise<Result<string>>;
    addPost(post: PostViewDto): Promise<Result<PostViewDto>>
    getComment(commentId: string): Promise<Result<CommentDto>>;
    addComment(comment: CommentCreateRequest): Promise<Result<CommentDto>>;
    updateComment(comment: CommentUpdateRequest): Promise<Result<CommentDto>>;
    deleteComment(commentId: string): Promise<Result<string>>;
    connectToCommentsWebSocket(postId: string): WebSocket;
}

class PostClientImpl implements IPostClient {
    private static async optionalAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
        let headers = options.headers;
        const token = localStorage.getItem('jwt');
        if (token) {
            headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            };
        }

        return fetch(`${backendURL}${endpoint}`, { ...options, headers });
    }

    private static async authenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
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

    public async getDiaryPosts(diary: string, page: number): Promise<Result<DiaryPageDto>> {
        try {
            const response = await PostClientImpl.optionalAuthenticatedRequest(`/posts/diary?diary=${encodeURIComponent(diary)}&page=${encodeURIComponent(page.toString())}`);

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

    public async addPost(post: PostCreateDto): Promise<Result<PostViewDto>> {
        try {
            const response = await PostClientImpl.authenticatedRequest('/posts', {
                method: 'POST',
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

    public async getPost(login: string, uri: string): Promise<Result<PostPageDto>> {
        try {
            const response = await PostClientImpl.optionalAuthenticatedRequest(`/posts?login=${encodeURIComponent(login)}&uri=${encodeURIComponent(uri)}`);
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

    public async getComment(commentId: string): Promise<Result<CommentDto>> {
        try {
            const response = await PostClientImpl.optionalAuthenticatedRequest(`/posts/comment?commentId=${encodeURIComponent(commentId)}`);
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

    public async searchDiaryPosts(params: SearchPostsParamsDto): Promise<Result<DiaryPageDto>> {
        try {
            const queryParams = new URLSearchParams();
            if (params.diary) queryParams.set('diary', params.diary);
            if (params.text) queryParams.set('text', params.text);
            if (params.tags) queryParams.set('tags', params.tags.join(','));
            if (params.tagPolicy) queryParams.set('tagPolicy', params.tagPolicy);
            if (params.from) queryParams.set('from', params.from);
            if (params.to) queryParams.set('to', params.to);
            if (params.page !== undefined) queryParams.set('page', params.page.toString());
            if (params.sort) queryParams.set('sort', params.sort.toLowerCase() === 'asc' ? 'asc' : 'desc');

            const response = await PostClientImpl.optionalAuthenticatedRequest(`/posts/diary?${queryParams.toString()}`);
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

    public async getLatestPosts(page = 0): Promise<Result<PostSearchResult>> {
        try {
            const response = await fetch(`${backendURL}/posts/latest`);
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

    public async getDiscussedPosts(page = 0, size = 10): Promise<Result<PostSearchResult>> {
        try {
            const response = await fetch(`${backendURL}/posts/discussed?page=${page}&size=${size}`);
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

    public async getFollowedPosts(page = 0, size = 10): Promise<Result<PostSearchResult>> {
        try {
            const response = await PostClientImpl.authenticatedRequest(`/posts/followed?page=${page}&size=${size}`);
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

    public async getPostForEditing(id: string): Promise<Result<PostEditDto>> {
        try {
            const response = await PostClientImpl.authenticatedRequest(`/posts?id=${encodeURIComponent(id)}`);
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

    public async updatePost(post: PostEditDto): Promise<Result<PostViewDto>> {
        try {
            const response = await PostClientImpl.authenticatedRequest('/posts', {
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

    public async deletePost(postId: string): Promise<Result<string>> {
        try {
            const response = await PostClientImpl.authenticatedRequest(`/posts?postId=${encodeURIComponent(postId)}`, {
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

    public async addComment(comment: CommentCreateRequest): Promise<Result<CommentDto>> {
        try {
            const response = await PostClientImpl.authenticatedRequest('/posts/comment', {
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

    public async updateComment(comment: CommentUpdateRequest): Promise<Result<CommentDto>> {
        try {
            const response = await PostClientImpl.authenticatedRequest('/posts/comment', {
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

    public async deleteComment(commentId: string): Promise<Result<string>> {
        try {
            const response = await PostClientImpl.authenticatedRequest(`/posts/comment?commentId=${encodeURIComponent(commentId)}`, {
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

    public connectToCommentsWebSocket(postId: string): WebSocket {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = backendURL.replace(/^https?:\/\//, '');
        const wsUrl = `${protocol}//${host}/posts/comments`;

        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            // Send subscribe message when connection is established
            const subscribeMessage = JSON.stringify({
                postId: postId,
                type: "Subscribe",
            });
            socket.send(subscribeMessage);
        };

        return socket;
    }
}

export default PostClientImpl;
