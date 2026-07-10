export interface RegistryEntity {
  id: string;
  type: string;
  label: string;
  route: string;
  keywords: string[];
}

export const entityRegistry: RegistryEntity[] = [];
