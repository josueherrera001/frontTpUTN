
export interface UploadedImg {
   id?: string;
  file: File;
  name: string;
  size: number;
  type: string;
  url: string | ArrayBuffer | null;
  secure_url?: string;
  public_id?: string;
  uploadDate: Date;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  cloudinaryData?: CloudinaryUploadResponse;
}
export interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
  api_key: string;
}
