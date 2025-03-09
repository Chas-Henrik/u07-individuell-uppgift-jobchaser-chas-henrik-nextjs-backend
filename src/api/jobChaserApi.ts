import { UserType, FavoriteType } from '@/types/types';

const API_URL="http://localhost:3000"

// users endpoints

export async function createUser(user: UserType): Promise<{result: boolean; message: string}> {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        const body = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to create user\nHTTP Status Code: ${response.status}\nError message: ${body.message}`);
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

export async function createFavorite(userId: number, favorite: FavoriteType): Promise<{result: boolean; message: string}> {
    try {
        const response = await fetch(`${API_URL}/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userId}`,  // TODO: replace with JWT auth handling
            },
            body: JSON.stringify(favorite),
        });

        const body = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to create favorite\nHTTP Status Code: ${response.status}\nError message: ${body.message}`);
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

export async function readFavorites(userId: number): Promise<{result: boolean; message: string; favorites: FavoriteType[]}> {
    try {
        const response = await fetch(`${API_URL}/favorites`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${userId}`,
            },
        });

        const body = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to read favorites\nHTTP Status Code: ${response.status}\nError message: ${body.message}`);
        }

        return {result: true, message: body.message, favorites: body.favorites};
    }
    catch (error) {
        if(error instanceof Error) {
            console.error(error.message);
            return {result: false, message: error.message, favorites: []};
        } else {
            console.error("error", String(error));
            return {result: false, message: String(error), favorites: []};
        }
    }
}

export async function deleteFavorite(userId: number, id: string): Promise<{result: boolean; message: string}> {
    try {
        const response = await fetch(`${API_URL}/favorites/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${userId}`,  // TODO: replace with JWT auth handling
            }
        });

        const body = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to delete favorite\nHTTP Status Code: ${response.status}\nError message: ${body.message}`);
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