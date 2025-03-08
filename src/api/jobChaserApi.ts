import { UserType } from '@/types/types';

const API_URL="http://localhost:3000"

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
