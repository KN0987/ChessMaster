type FetchWithAuthOptions = {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
}

export default async function fetchWithAuth(url: string, options: FetchWithAuthOptions = {}) {
    const token = localStorage.getItem("sessionId");
    if (!token) {
        throw new Error("No authentication token found");
    }

    const defaultHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return response.json();
    
}
