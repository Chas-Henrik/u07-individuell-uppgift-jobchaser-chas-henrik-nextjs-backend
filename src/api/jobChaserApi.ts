import { UserType, UserCredentialsType, FavoriteType } from '@/types/types';

const API_URL="http://localhost:3008"

// users endpoints

export async function signUp(user: UserType): Promise<{result: boolean; message: string}> {
    try {
        const response = await fetch(`${API_URL}/sign-up`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(user),
        });

        const body = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to create user\nHTTP Status Code: ${response.status} ${response.statusText}\nError message: ${body.message}`);
        }

        return {result: true, message: body.message};
    }
    catch (error) {
        if(error instanceof Error) {
            console.error(error.message);
            return {result: false, message: error.message};
        } else {
            console.error("error", String(error));
            return {result: false, message: String(error)};
        }
    }
}

export async function signIn(user: UserCredentialsType): Promise<{result: boolean; message: string}> {
    try {
        const response = await fetch(`${API_URL}/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(user),
        });

        const body = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to sign-in user\nHTTP Status Code: ${response.status} ${response.statusText}\nError message: ${body.message}`);
        }

        return {result: true, message: body.message};
    }
    catch (error) {
        if(error instanceof Error) {
            console.error(error.message);
            return {result: false, message: error.message};
        } else {
            console.error("error", String(error));
            return {result: false, message: String(error)};
        }
    }
}

export async function signOut(): Promise<{result: boolean; message: string}> {
    try {
        const response = await fetch(`${API_URL}/sign-out`, {
            method: 'POST',
            credentials: 'include',
        });

        const body = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to sign-out user\nHTTP Status Code: ${response.status} ${response.statusText}\nError message: ${body.message}`);
        }

        return {result: true, message: body.message};
    }
    catch (error) {
        if(error instanceof Error) {
            console.error(error.message);
            return {result: false, message: error.message};
        } else {
            console.error("error", String(error));
            return {result: false, message: String(error)};
        }
    }
}

// favorites endpoints

export async function createFavorite(favorite: FavoriteType): Promise<{result: boolean; redirect: boolean; message: string}> {
    let redirect = false;
    try {
        const response = await fetch(`${API_URL}/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(favorite),
        });

        const body = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                redirect = true;
            }
            throw new Error(`Failed to create favorite\nHTTP Status Code: ${response.status} ${response.statusText}\nError message: ${body.message}`);
        }

        return {result: true, redirect: redirect, message: body.message};
    }
    catch (error) {
        if(error instanceof Error) {
            return {result: false, redirect: redirect, message: error.message};
        } else {
            return {result: false, redirect: redirect, message: String(error)};
        }
    }
}

export class ErrorUnauthorized extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ErrorUnauthorized";
    }
}

export async function readFavorites(): Promise<FavoriteType[]> {
    let unAuthorized = false;
    try {
        const response = await fetch(`${API_URL}/favorites`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            if (response.status === 401) {
                unAuthorized = true;
            }
            throw new Error(`Failed to read favorites\nHTTP Status Code: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        const errorStr = (error instanceof Error) ? error.message : String(error);
        if(unAuthorized) {
            throw new ErrorUnauthorized(errorStr);
        } else {
            throw new Error(errorStr);
        }
    }
}

export async function deleteFavorite(id: string): Promise<{result: boolean; redirect: boolean; message: string}> {
    let redirect = false;
    try {
        const response = await fetch(`${API_URL}/favorites/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        const body = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                redirect = true;
            }
            throw new Error(`Failed to delete favorite\nHTTP Status Code: ${response.status} ${response.statusText}\nError message: ${body.message}`);
        }

        return {result: true, redirect: redirect, message: body.message};
    }
    catch (error) {
        if(error instanceof Error) {
            return {result: false, redirect: redirect, message: error.message};
        } else {
            return {result: false, redirect: redirect, message: String(error)};
        }
    }
}