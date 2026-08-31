// Use a relative path so the app works on any domain it is deployed to.
// For local dev, set VITE_API_BASE_URL=http://localhost:5000/api in client/.env.development.local
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    console.log("Calling API:", url);

    const config = {
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);

        console.log("Response status:", response.status);

        const data = await response.json();

        console.log("Response data:", data);

        if (!response.ok) {
            throw new Error(data.error || data.message || "Request failed");
        }

        return data;
    } catch (err) {
        console.error("Fetch failed:", err);
        throw err;
    }
}

export const api = {
    post: (endpoint, body) =>
        request(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
        }),
};