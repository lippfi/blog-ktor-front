import { backendURL } from "@/main";

interface SignInData {
    login: string;
    password: string;
}

type LoginResult =
    | { type: 'ok' }
    | { type: 'error'; message: string };

export async function signIn(login: string, password: string): Promise<LoginResult> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password } as SignInData)
    };

    const response = await fetch(`${backendURL}/user/sign-in`, requestOptions);
    let result: LoginResult
    if (response.ok) {
        const token = await response.text();
        localStorage.setItem('jwt', token);
        result = { type: 'ok' };
    } else {
        const text = await response.text();
        result = { type: 'error', message: text };
    }
    return result;
}

interface SignUpData {
    login: string;
    nickname: string;
    email: string;
    password: string;
}

type RegistrationResult =
    | { type: 'ok' }
    | { type: 'error'; message: string };

export async function signUp(
    login: string,
    nickname: string,
    email: string,
    password: string,
    inviteCode: string,
): Promise<RegistrationResult> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, nickname, email, password } as SignUpData)
    };
    const url = inviteCode.trim()
        ? `${backendURL}/user/sign-up?inviteCode=${encodeURIComponent(inviteCode)}`
        : `${backendURL}/user/sign-up`
    const response = await fetch(url, requestOptions);

    let result: RegistrationResult;
    if (response.ok) {
        result = { type : 'ok' }
    } else {
        result = { type: 'error', message : await response.text() }
    }
    return result;
}

export async function isLoginBusy(login: string): Promise<boolean> {
    const response = await fetch(`${backendURL}/user/is-login-busy?login=${encodeURIComponent(login)}`);
    const text = await response.text();
    return text === 'true';
}

export async function isNicknameBusy(nickname: string): Promise<boolean> {
    const response = await fetch(`${backendURL}/user/is-nickname-busy?nickname=${encodeURIComponent(nickname)}`);
    const text = await response.text();
    return text === 'true';
}

export async function isEmailBusy(email: string): Promise<boolean> {
    const response = await fetch(`${backendURL}/user/is-email-busy?email=${encodeURIComponent(email)}`);
    const text = await response.text();
    return text === 'true';
}

export function logOut(): void {
    localStorage.removeItem('jwt');
}
//
// export async function getAvatars(): Promise<string[]> {
//     const response = await fetch(`${backendURL}/avatars`);
//     if (!response.ok) await handleAuthError(response);
//     return response.json();
// }