// 파일 요청 DTO
export interface FileRequestDto {
  uploadDirPath: string;
  originalFileName: string;
  storedFileName: string;
  uploadTempPath: string;
  fileSizeByte: number;
}

// 파일 응답 DTO
export interface FileResponseDto {
  fileId: number;
  uploadDirPath: string;
  originalFileName: string;
  storedFileName: string;
  fileSizeByte: number;
  uploadDate: string;
}

// 파일 저장 요청 DTO
export interface FileSaveRequestDto {
  uploadDirPath: string;
  originalFileName: string;
  storedFileName: string;
  uploadTempPath: string;
  fileSizeByte: number;
} 