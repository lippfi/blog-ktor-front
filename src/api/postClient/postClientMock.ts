import { backendURL } from "@/main.ts";
import type {
    CommentCreateRequest,
    CommentDto,
    CommentUpdateRequest,
    PostDto,
    PostEditDto, PostSearchResult,
    SearchPostsParamsDto
} from "@/api/dto/postServiceDto.ts";
import type {IPostClient} from "@/api/postClient/postClient.ts";
import type {Comment, Post, Reaction} from "@/models/posts/post.ts";
import {mapPostToDto} from "@/api/dto/mapper.ts";
import {mapPostDtoToPost} from "@/models/posts/mapper.ts";


type Result<T> =
    | { type: 'ok'; data: T }
    | { type: 'error'; message: string };

class PostClientMock implements IPostClient {

    stubReaction: Reaction = {
        id: 'tastatarstn',
        name: 'sad_cat',
        iconUri: 'https://emoji.slack-edge.com/T0288D531/sad_cat/4253f3b1013d6920.png',
        count: 3,
        anonymousCount: 0,
        userNicknames: ['детектив шимпански', 'птица не спит', 'саша белый'],
        userReacted: true
    };

    stubReaction2: Reaction = {
        id: 'taintaiestnai',
        name: 'begemot',
        iconUri: 'src/assets/icons/begemot.png',
        count: 2,
        anonymousCount: 0,
        userNicknames: ['bikechan', 'Фауст'],
        userReacted: false
    };


    stubComment: Comment = {
        id: '1',
        avatar: 'https://i.pinimg.com/550x/56/90/72/569072435a51a4c2690e08a3026de5a0.jpg',
        authorLogin: 'john_doe',
        authorNickname: 'John Doe',
        text: 'This is a test comment',
        creationTime: new Date('17:35 12.20.24'),
        isReactable: true,
        reactions: [this.stubReaction],
        reactionGroupId: 'comment-reactions-1'
    }

    stubComment2: Comment = {
        id: '1',
        avatar: 'https://i.pinimg.com/550x/56/90/72/569072435a51a4c2690e08a3026de5a0.jpg',
        authorLogin: 'shimpansky',
        authorNickname: 'Ванючка боб',
        text: 'Я ебал бабра',
        creationTime: new Date('17:35 12.20.24'),
        isReactable: true,
        reactions: [this.stubReaction],
        reactionGroupId: 'comment-reactions-1'
    };

    stubPost: Post = {
        id: '1',
        uri: 'test-post',
        avatar: 'https://i.pinimg.com/550x/56/90/72/569072435a51a4c2690e08a3026de5a0.jpg',
        authorLogin: 'shimpansky',
        authorNickname: 'детектив шимпански',
        title: '7942',
        text: "I'm a little late, but here are the month's totals:\nI finally made an appointment with my ENT and had nose surgery in the middle of the month. I haven't fully recovered yet, but I have this feeling that breathing is... cool?\nI've tried hiking, but it was too hard for me. I became exhausted after gaining only 300m of elevation. I'll definitely go again, but I'll practice with easier hikes first.\nThe scenery was very beautiful. Here are some photos:\n[slider]\n[slide][image link=\"https://lipp.fi/static/images/62944b84-4126-4b48-9014-fac7471dc875.jpg\" description=\"\"][/slide]\n [slide][image link=\"https://lipp.fi/static/images/2306c07a-d67c-4144-8562-a7ca85a0976e.jpg\" description=\"\"][/slide]\n [slide][image link=\"https://lipp.fi/static/images/42be085e-5389-4b2c-99a4-242ef211b700.jpg\" description=\"\"][/slide]\n [slide][image link=\"https://lipp.fi/static/images/7732076f-74ab-4327-9991-3ebcc78f817f.jpg\" description=\"\"][/slide]\n[/slider]\n\n[expandable name=\"Read more..\"]\nThis month's recipe is baked artichokes. Although I failed to capture a sexy photo, the artichokes were delicious and definitely deserve a spot here.[slider]\n [slide][image link=\"https://lipp.fi/static/images/a88f8f43-971b-4297-8111-f4537bcba27b.jpg\" description=\"\"][/slide]\n [slide][image link=\"https://lipp.fi/static/images/b90484ee-5f29-40cc-a6e9-71f63ac98615.jpg\" description=\"\"][/slide]\n[/slider][/expandable]",
        // text: 'testtastn oariet narisoetnrsoietnrois entorie ntrosien tarosietn aroiten roisetn ras',
        // creationTime: '17:35 12.20.24',
        creationTime: new Date(),
        isPreface: false,
        isEncrypted: false,
        classes: 'test-post',
        tags: ['test', 'example'],
        isReactable: true,
        reactions: [this.stubReaction, this.stubReaction2],
        isCommentable: true,
        comments: [this.stubComment, this.stubComment2],
        readGroupId: 'read-group-1',
        commentGroupId: 'comment-group-1',
        reactionGroupId: 'reaction-group-1',
        commentReactionGroupId: 'comment-reactions-group-1'
    };

    stubPosts: Post[] = [ this.stubPost ]


    public async getDiaryPosts(diary: string, page: number): Promise<Result<PostSearchResult>> {
        try {
            const postRes: PostDto[] = this.stubPosts.map((c) => mapPostToDto(c))
            const searchResult: PostSearchResult = {
                result: postRes,
                totalPageCount: 10
            } as PostSearchResult;

            return { type: 'ok', data: searchResult};
        } catch (error) {
            return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
        }
    }

    public async getDiaryPreface(diary: string): Promise<Result<PostDto>> {
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

    public async getPost(login: string, uri: string): Promise<Result<PostDto>> {
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

    public async searchPosts(params: SearchPostsParamsDto): Promise<Result<PostSearchResult>> {
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

    public async getAllPosts(offset = 0, count = 10): Promise<Result<PostSearchResult>> {
        try {
            const response = await fetch(`${backendURL}/posts`);
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
            return { type: 'ok', data: ({} as any) as PostSearchResult };
        } catch (error) {
            return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
        }
    }

    public async getPostForEditing(id: string): Promise<Result<PostEditDto>> {
        try {
            return { type: 'ok', data: <PostEditDto> { } };
        } catch (error) {
            return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
        }
    }

    public async updatePost(post: PostEditDto): Promise<Result<PostDto>> {
        try {
            this.stubPosts.forEach(x => {
                if (x.id == post.id) {
                    x.avatar = post.avatar;
                    x.text = post.text;
                    x.title = post.title;
                    x.tags = post.tags
                }
            })
            return { type: 'ok', data: ({} as any) as PostDto };
        } catch (error) {
            return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
        }
    }

    public async deletePost(postId: string): Promise<Result<string>> {
        try {
            return { type: 'ok', data: "" };
        } catch (error) {
            return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
        }
    }

    public async addComment(comment: CommentCreateRequest): Promise<Result<CommentDto>> {
        try {
            this.stubPosts.forEach(x => {
                if (x.id == comment.postId) {
                    const id: string = this.makeid(3);
                    const newComment : Comment = {
                        id: id,
                        text: comment.text,
                        avatar: comment.avatar,
                        isReactable: true,
                        authorLogin: "pidarok",
                        authorNickname: "gomogey",
                        creationTime: new Date()
                    }
                    x.comments.push( newComment )
                }
            })
            return { type: 'ok', data: ({} as any) as CommentDto };
        } catch (error) {
            return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
        }
    }

    public async updateComment(comment: CommentUpdateRequest): Promise<Result<CommentDto>> {
        try {
            this.stubPosts.forEach(x => {
                if (x.id == comment.id) {
                    x.text = comment.text
                }
            })
            return { type: 'ok', data: ({} as any) as CommentDto };
        } catch (error) {
            return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
        }
    }

    public async deleteComment(commentId: string): Promise<Result<string>> {
        try {
            this.stubPosts.forEach(x => {
                x.comments = x.comments.filter(c => c.id != commentId)
            })
            return { type: 'ok', data: "" };
        } catch (error) {
            return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
        }
    }

    public async addPost(post: PostDto): Promise<Result<PostDto>> {
        try {
            this.stubPosts.push(mapPostDtoToPost(post))
            return { type: 'ok', data: post };
        } catch (error) {
            return { type: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
        }
    }

    makeid(length: number) : string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
}

export default PostClientMock;