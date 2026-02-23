export interface IFileMetadata {
  originalName: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  size: number;
  extension: string;
}

export interface IFileStorage {
  save(file: Express.Multer.File, options?: any): Promise<IFileMetadata>;
  get(filePath: string): Promise<Buffer>;
  delete(filePath: string): Promise<void>;
  getUrl?(filePath: string): string;
}