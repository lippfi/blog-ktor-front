import { authenticatedRequest } from "@/api/apiUtils";

type Result<T> =
    | { type: 'ok'; data: T }
    | { type: 'error'; message: string };

function getUploadErrorMessage(status: number, fallbackMessage: string): string {
    switch (status) {
        case 413:
            return 'File size exceeds the maximum limit';
        case 415:
            return 'File type is not supported';
        case 400:
            return 'Invalid file upload request';
        default:
            return fallbackMessage;
    }
}

async function upload(endpoint: string, files: File[]): Promise<Result<string[]>> {
    try {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('file', file, file.name);
        });

        const response = await authenticatedRequest(endpoint, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            return { type: 'ok', data: await response.json() as string[] };
        }

        const fallbackMessage = await response.text();
        return {
            type: 'error',
            message: getUploadErrorMessage(response.status, fallbackMessage),
        };
    } catch (error) {
        return {
            type: 'error',
            message: error instanceof Error ? error.message : 'Unknown error occurred during file upload',
        };
    }
}

export const storageClient = {
    uploadFiles(files: File[]): Promise<Result<string[]>> {
        return upload('/storage/upload', files);
    },

    uploadAvatarFiles(files: File[]): Promise<Result<string[]>> {
        return upload('/storage/upload-avatars', files);
    },
};
