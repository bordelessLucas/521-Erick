export interface CollaboratorSummary {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface ProvisionCollaboratorInput {
  name: string;
  email: string;
  password?: string; // Optional, can be generated if not provided
}

export interface ICollaboratorRepository {
  getAll(): Promise<CollaboratorSummary[]>;
  provisionCollaborator(input: ProvisionCollaboratorInput): Promise<void>;
  deleteCollaborator(id: string): Promise<void>;
}
