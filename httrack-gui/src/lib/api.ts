import { Project, ProjectFormData } from '../types/project';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new APIError(
        errorData?.message || 'API request failed',
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

export const projectsAPI = {
  list: async (): Promise<Project[]> => {
    return fetchAPI<Project[]>('/projects');
  },

  get: async (id: string): Promise<Project> => {
    return fetchAPI<Project>(`/projects/${id}`);
  },

  create: async (data: ProjectFormData): Promise<Project> => {
    return fetchAPI<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<ProjectFormData>): Promise<Project> => {
    return fetchAPI<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return fetchAPI<void>(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  start: async (id: string): Promise<void> => {
    return fetchAPI<void>(`/projects/${id}/start`, {
      method: 'POST',
    });
  },

  pause: async (id: string): Promise<void> => {
    return fetchAPI<void>(`/projects/${id}/pause`, {
      method: 'POST',
    });
  },

  stop: async (id: string): Promise<void> => {
    return fetchAPI<void>(`/projects/${id}/stop`, {
      method: 'POST',
    });
  },
};

export const settingsAPI = {
  get: async (): Promise<Record<string, unknown>> => {
    return fetchAPI<Record<string, unknown>>('/settings');
  },

  update: async (settings: Record<string, unknown>): Promise<void> => {
    return fetchAPI<void>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

export const statsAPI = {
  get: async (): Promise<Record<string, unknown>> => {
    return fetchAPI<Record<string, unknown>>('/stats');
  },
};
