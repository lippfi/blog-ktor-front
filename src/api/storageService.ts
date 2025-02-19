import { backendURL } from "@/main";

type Result<T> = 
    | { type: 'ok'; data: T }
    | { type: 'error'; message: string };

// Helper function for authenticated requests
async function authenticatedRequest(
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

    return fetch(`${backendURL}${endpoint}`, { ...options, headers });
}

/**
 * Uploads one or more files to the server
 * @param files - Array of files to upload
 * @returns urls of uploaded files
 */
export async function uploadFiles(files: File[]): Promise<Result<string[]>> {
    try {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file, file.name);
        });

        const response = await authenticatedRequest('/storage/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            return { type: 'ok', data };
        } else {
            let message = await response.text();
            
            // Handle specific error cases
            switch (response.status) {
                case 413:
                    message = 'File size exceeds the maximum limit';
                    break;
                case 415:
                    message = 'File type is not supported';
                    break;
                case 400:
                    message = 'Invalid file upload request';
                    break;
            }
            
            return { type: 'error', message };
        }
    } catch (error) {
        return { 
            type: 'error', 
            message: error instanceof Error ? error.message : 'Unknown error occurred during file upload'
        };
    }
}