import { entityRegistry, RegistryEntity } from '@/data/entityRegistry';

export function searchEntities(query: string): RegistryEntity[] {
  if (!query) return [];
  const lowercaseQuery = query.toLowerCase().trim();
  
  return entityRegistry.filter(entity => {
    const matchesLabel = entity.label.toLowerCase().includes(lowercaseQuery);
    const matchesId = entity.id.toLowerCase().includes(lowercaseQuery);
    const matchesKeywords = entity.keywords.some(kw => kw.toLowerCase().includes(lowercaseQuery));
    
    return matchesLabel || matchesId || matchesKeywords;
  });
}
