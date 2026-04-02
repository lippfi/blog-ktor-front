import { backendURL } from "@/constants";

export async function authenticatedRequest(
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

export async function optionalAuthenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> {
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
