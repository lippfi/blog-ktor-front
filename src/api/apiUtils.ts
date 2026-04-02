import { backendURL } from "@/constants";
import router from "@/router";

function handleUnauthorized(response: Response): Response {
    if (response.status === 401) {
        localStorage.removeItem('jwt');
        localStorage.removeItem('tokenPair');
        localStorage.removeItem('sessionInfo');
        localStorage.removeItem('timeToSessionInfo');
        router.push('/login');
    }
    return response;
}

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

    const response = await fetch(`${backendURL}${endpoint}`, { ...options, headers });
    return handleUnauthorized(response);
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

    const response = await fetch(`${backendURL}${endpoint}`, { ...options, headers });
    return handleUnauthorized(response);
}
