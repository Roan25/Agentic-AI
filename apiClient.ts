
// In a real application, this would point to your deployed backend service.
const API_BASE_URL = '/api'; // Using a relative URL for proxying in development

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    const config: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            let errorBody;
            try {
                errorBody = await response.json();
            } catch (e) {
                // If the body isn't JSON, use the status text
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            // Use the server's error message if available
            const errorMessage = errorBody.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }
        
        // Handle cases where the response might be empty (e.g., a 204 No Content)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json() as T;
        } else {
            // Return an empty object or handle as needed if no JSON is expected
            return {} as T;
        }

    } catch (error) {
        // console.error(`API request failed: ${error}`); // Suppressed for demo mode
        // Re-throw the error so it can be caught by the calling function's try/catch block
        throw error;
    }
}

export const apiClient = {
    get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, body: unknown) => request<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
    }),
    put: <T>(endpoint: string, body: unknown) => request<T>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
    }),
    delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
