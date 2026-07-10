export interface MediaAsset {
  id: string;
  name: string;
  type: 'video' | 'image' | 'pdf' | 'document';
  size: string;
  resolution: string;
  uploadedBy: string;
  uploadedDate: string;
  version: 'v1' | 'v2' | 'v3';
  aiTags: string[];
  companyId: string;
  campaignId: string;
  spaceIds: string[];
  status: 'Approved' | 'Pending' | 'Revision';
  versionsList: Array<{ version: string; date: string; file: string; uploader: string }>;
}

export const mediaAssets: MediaAsset[] = [];
