// EditCaseAPI.js
const AZURE_FUNCTION_URL = 'https://your-function-app.azurewebsites.net/api/editIncident'; // TODO: Replace with actual Azure Function URL

export async function editIncident({ body }) {
    try {
        const response = await fetch(AZURE_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // TODO: Add any required authentication headers
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to edit incident');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}