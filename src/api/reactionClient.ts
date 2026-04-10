import { backendURL } from '@/constants';
import { authenticatedRequest } from '@/api/apiUtils';
import type { ReactionView, ReactionPack, ReactionInfo } from '@/api/dto/reactionServiceDto';

const REACTION_NAMES_CACHE_KEY = 'reactionNamesCache';
const REACTION_NAMES_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 week

interface ReactionNamesCacheEntry {
    expiresAt: number;
    value: ReactionView[];
}

function normalizeReactionNames(names: string): string {
    return names
        .split(',')
        .map(name => name.trim())
        .filter(Boolean)
        .sort()
        .join(',');
}

function getReactionNamesCacheEntry(cacheKey: string): ReactionNamesCacheEntry | null {
    try {
        const rawCache = localStorage.getItem(REACTION_NAMES_CACHE_KEY);
        if (!rawCache) {
            return null;
        }

        const cache = JSON.parse(rawCache) as Record<string, ReactionNamesCacheEntry>;
        const cacheEntry = cache[cacheKey];
        if (!cacheEntry) {
            return null;
        }

        if (cacheEntry.expiresAt <= Date.now()) {
            delete cache[cacheKey];
            localStorage.setItem(REACTION_NAMES_CACHE_KEY, JSON.stringify(cache));
            return null;
        }

        return cacheEntry;
    } catch (error) {
        console.error('Failed to read reactions cache:', error);
        return null;
    }
}

function setReactionNamesCacheEntry(cacheKey: string, value: ReactionView[]): void {
    try {
        const rawCache = localStorage.getItem(REACTION_NAMES_CACHE_KEY);
        const cache = rawCache ? JSON.parse(rawCache) as Record<string, ReactionNamesCacheEntry> : {};
        cache[cacheKey] = {
            value,
            expiresAt: Date.now() + REACTION_NAMES_CACHE_DURATION,
        };
        localStorage.setItem(REACTION_NAMES_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error('Failed to write reactions cache:', error);
    }
}

// Re-export DTOs for convenience
export type { ReactionView, ReactionPack, ReactionUserInfo, ReactionInfo, ReactionViewDto, ReactionPackDto } from '@/api/dto/reactionServiceDto';

// --- Reactions CRUD ---

export async function getAllReactions(): Promise<ReactionView[]> {
    const response = await fetch(`${backendURL}/reactions`);
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export async function deleteReaction(name: string): Promise<string> {
    const response = await authenticatedRequest(`/reactions?name=${encodeURIComponent(name)}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error(await response.text());
    return response.text();
}

// --- Search ---

export async function searchReactions(text?: string, pattern?: string): Promise<ReactionView[]> {
    const params = new URLSearchParams();
    if (text !== undefined) params.set('text', text);
    if (pattern !== undefined) params.set('pattern', pattern);
    const query = params.toString();
    const url = query ? `${backendURL}/reactions/search?${query}` : `${backendURL}/reactions/search`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export async function getReactionsByNames(names: string): Promise<ReactionView[]> {
    const normalizedNames = normalizeReactionNames(names);
    if (!normalizedNames) {
        return [];
    }

    const cachedResponse = getReactionNamesCacheEntry(normalizedNames);
    if (cachedResponse) {
        return cachedResponse.value;
    }

    const response = await fetch(`${backendURL}/reactions/search-names?names=${encodeURIComponent(normalizedNames)}`);
    if (!response.ok) throw new Error(await response.text());
    const reactions = await response.json() as ReactionView[];
    setReactionNamesCacheEntry(normalizedNames, reactions);
    return reactions;
}

// --- Basic & Recent ---

export async function getBasicReactions(): Promise<ReactionPack[]> {
    const response = await fetch(`${backendURL}/reactions/basic`);
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export async function getRecentReactions(limit: number = 50): Promise<ReactionView[]> {
    const response = await authenticatedRequest(`/reactions/recent?limit=${limit}`);
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// --- Name availability ---

export async function isReactionNameBusy(name: string): Promise<{ busy: boolean }> {
    const response = await fetch(`${backendURL}/reactions/name-busy?name=${encodeURIComponent(name)}`);
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// --- Packs ---

export async function getMyPacks(): Promise<ReactionPack[]> {
    const response = await authenticatedRequest('/reactions/my-packs');
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// --- Create & Rename ---

export async function createReaction(name: string, pack: string, file: File): Promise<ReactionView> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await authenticatedRequest(
        `/reactions/create?name=${encodeURIComponent(name)}&pack=${encodeURIComponent(pack)}`,
        { method: 'POST', body: formData },
    );
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export async function renameReaction(oldName: string, newName: string): Promise<string> {
    const response = await authenticatedRequest(
        `/reactions/rename?oldName=${encodeURIComponent(oldName)}&newName=${encodeURIComponent(newName)}`,
        { method: 'PUT' },
    );
    if (!response.ok) throw new Error(await response.text());
    return response.text();
}

// --- Pack management ---

export async function updatePack(pack: string, newName?: string, icon?: File): Promise<ReactionPack> {
    const params = new URLSearchParams({ pack });
    if (newName !== undefined) params.set('newName', newName);
    const formData = new FormData();
    if (icon) formData.append('icon', icon);
    const response = await authenticatedRequest(`/reactions/pack?${params.toString()}`, {
        method: 'PUT',
        body: formData,
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// --- Collection ---

export async function getCollection(): Promise<ReactionPack[]> {
    const response = await authenticatedRequest('/reactions/collection');
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export async function addPackToCollection(pack: string): Promise<string> {
    const response = await authenticatedRequest(`/reactions/collection?pack=${encodeURIComponent(pack)}`, {
        method: 'POST',
    });
    if (!response.ok) throw new Error(await response.text());
    return response.text();
}

export async function removePackFromCollection(pack: string): Promise<string> {
    const response = await authenticatedRequest(`/reactions/collection?pack=${encodeURIComponent(pack)}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error(await response.text());
    return response.text();
}

export async function reorderPackInCollection(pack: string, ordinal: number): Promise<string> {
    const response = await authenticatedRequest(
        `/reactions/collection/reorder?pack=${encodeURIComponent(pack)}&ordinal=${ordinal}`,
        { method: 'PUT' },
    );
    if (!response.ok) throw new Error(await response.text());
    return response.text();
}

// --- Subsets ---

export async function createSubset(login: string, name: string, reactions?: string): Promise<{ id: string }> {
    const params = new URLSearchParams({ login, name });
    if (reactions !== undefined) params.set('reactions', reactions);
    const response = await authenticatedRequest(`/reactions/subset?${params.toString()}`, {
        method: 'POST',
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export async function updateSubset(id: string, name?: string, reactions?: string): Promise<string> {
    const params = new URLSearchParams({ id });
    if (name !== undefined) params.set('name', name);
    if (reactions !== undefined) params.set('reactions', reactions);
    const response = await authenticatedRequest(`/reactions/subset?${params.toString()}`, {
        method: 'PUT',
    });
    if (!response.ok) throw new Error(await response.text());
    return response.text();
}

export async function deleteSubset(id: string): Promise<string> {
    const response = await authenticatedRequest(`/reactions/subset?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error(await response.text());
    return response.text();
}

// --- Post reactions ---

export async function addPostReaction(login: string, uri: string, name: string): Promise<string> {
    const response = await authenticatedRequest(
        `/reactions/post-reaction?login=${encodeURIComponent(login)}&uri=${encodeURIComponent(uri)}&name=${encodeURIComponent(name)}`,
        { method: 'POST' },
    );
    if (!response.ok) throw new Error(await response.text());
    return response.text();
}

export async function removePostReaction(login: string, uri: string, name: string): Promise<string> {
    const response = await authenticatedRequest(
        `/reactions/post-reaction?login=${encodeURIComponent(login)}&uri=${encodeURIComponent(uri)}&name=${encodeURIComponent(name)}`,
        { method: 'DELETE' },
    );
    if (!response.ok) throw new Error(await response.text());
    return response.text();
}

// --- Comment reactions ---

export async function addCommentReaction(commentId: string, name: string): Promise<string> {
    const response = await authenticatedRequest(
        `/reactions/comment-reaction?commentId=${encodeURIComponent(commentId)}&name=${encodeURIComponent(name)}`,
        { method: 'POST' },
    );
    if (!response.ok) throw new Error(await response.text());
    return response.text();
}

export async function removeCommentReaction(commentId: string, name: string): Promise<string> {
    const response = await authenticatedRequest(
        `/reactions/comment-reaction?commentId=${encodeURIComponent(commentId)}&name=${encodeURIComponent(name)}`,
        { method: 'DELETE' },
    );
    if (!response.ok) throw new Error(await response.text());
    return response.text();
}

export async function getCommentReactions(commentId: string): Promise<ReactionInfo[]> {
    const response = await authenticatedRequest(
        `/reactions/comment-reactions?commentId=${encodeURIComponent(commentId)}`,
    );
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// --- Backward-compatible aliases ---

/** @deprecated Use getReactionsByNames */
export async function getReactions(names: string[]): Promise<ReactionView[]> {
    return getReactionsByNames(names.join(','));
}
