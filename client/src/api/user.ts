import fetchWithAuth from "../utils/FetchWithAuth";
import { BACKEND_URL } from "../config/config";

export const getUserData = async () => {
    const response = await fetchWithAuth(`${BACKEND_URL}/api/user/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user data');
    }

    return await response.json();
}