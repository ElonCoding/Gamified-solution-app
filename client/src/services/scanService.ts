import apiClient from "../config/api";

export interface ScanResponse {
    success: boolean;
    data?: any;
    error?: string;
}

export interface RewardGenerationResponse {
    success: boolean;
    taskId?: string;
    message?: string;
    error?: string;
}

export interface TaskStatusResponse {
    success: boolean;
    data: any;
    error?: string;
}

/**
 * Uploads a test submission scan
 */
export const uploadScan = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post<ScanResponse>(
        "/api/v1/scan",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

/**
 * Triggers AI reward generation based on submission
 */
export const generateRewardTask = async (content: string, token: string) => {
    const response = await apiClient.post<RewardGenerationResponse>(
        "/api/v1/scan/generate",
        { wish: content },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

/**
 * Checks the status of a 3D reward generation task
 */
export const checkTaskStatus = async (taskId: string, token: string) => {
    const response = await apiClient.get<TaskStatusResponse>(
        `/api/v1/scan/status/${taskId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

/**
 * Manually approve a reward (Educator Action)
 */
export const approveReward = async (data: any, token: string) => {
    const response = await apiClient.post<any>('/api/v1/scan/approve', data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

/**
 * Fetches all earned rewards for the student
 */
export const getStudentSubmissions = async (token: string) => {
    const response = await apiClient.get<any>('/api/v1/scan/submissions', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

/**
 * Fetches single reward details
 */
export const getSubmissionById = async (id: string, token: string) => {
    const response = await apiClient.get<any>(`/api/v1/scan/submissions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

/**
 * Educator Admin: Fetch pending verification queue
 */
export const getEducatorQueue = async () => {
    const response = await apiClient.get<any>('/api/v1/scan/educator/submissions');
    return response.data;
};

/**
 * Educator Admin: Update submission status (Verify/Reject)
 */
export const updateSubmissionStatus = async (id: string, status: 'pending' | 'approved' | 'denied') => {
    const response = await apiClient.put<any>(`/api/v1/scan/educator/update/${id}`, { status });
    return response.data;
};
