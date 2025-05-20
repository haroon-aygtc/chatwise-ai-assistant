import {
    FileText,
    FileSpreadsheet,
    File as FileIcon,
    FileText as FileTextIcon,
    Image as ImageIcon,
    Video as VideoIcon,
    FileSpreadsheet as FileSpreadsheetIcon,
    Presentation,
    Archive,
    FileCode,
    FileCode as FileCodeIcon,
    AudioLines as FileAudioIcon,
    HelpCircle as FileQuestion
} from "lucide-react";
import { FileType as KnowledgeFileType } from "@/types/knowledge-base";

/**
 * Returns the appropriate Lucide icon component based on the file type
 */
export function getFileTypeIcon(fileType: KnowledgeFileType) {
    switch (fileType) {
        case "PDF":
            return FileIcon;
        case "DOCX":
            return FileText;
        case "XLSX":
            return FileSpreadsheet;
        case "CSV":
            return FileSpreadsheet;
        case "JSON":
            return FileIcon;
        case "HTML":
            return FileCode;
        case "MD":
            return FileText;
        case "TXT":
            return FileText;
        default:
            return FileQuestion;
    }
}

/**
 * Returns the mime type for a given file type
 */
export function getMimeType(fileType: KnowledgeFileType): string {
    switch (fileType) {
        case "PDF":
            return "application/pdf";
        case "DOCX":
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        case "XLSX":
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        case "CSV":
            return "text/csv";
        case "JSON":
            return "application/json";
        case "HTML":
            return "text/html";
        case "MD":
            return "text/markdown";
        case "TXT":
            return "text/plain";
        default:
            return "application/octet-stream";
    }
}

/**
 * Returns the file extension for a given file type
 */
export function getFileExtension(fileType: KnowledgeFileType): string {
    switch (fileType) {
        case "PDF":
            return ".pdf";
        case "DOCX":
            return ".docx";
        case "XLSX":
            return ".xlsx";
        case "CSV":
            return ".csv";
        case "JSON":
            return ".json";
        case "HTML":
            return ".html";
        case "MD":
            return ".md";
        case "TXT":
            return ".txt";
        default:
            return "";
    }
}

// File extensions categorized by type
const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico', 'tiff'];
const documentExtensions = ['doc', 'docx', 'txt', 'rtf', 'md', 'odt'];
const spreadsheetExtensions = ['xls', 'xlsx', 'csv', 'ods'];
const presentationExtensions = ['ppt', 'pptx', 'odp'];
const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];
const codeExtensions = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp', 'php', 'html', 'css', 'json', 'xml', 'yaml', 'yml'];
const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac'];
const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
const pdfExtensions = ['pdf'];

/**
 * Get the icon component for a file based on its extension
 * @param filename The filename or path to get the icon for
 * @returns A Lucide icon component
 */
export function getFileIcon(filename: string) {
    if (!filename) return FileQuestion;

    // Extract extension from filename
    const extension = filename.split('.').pop()?.toLowerCase() || '';

    if (imageExtensions.includes(extension)) {
        return ImageIcon;
    } else if (documentExtensions.includes(extension)) {
        return FileTextIcon;
    } else if (spreadsheetExtensions.includes(extension)) {
        return FileSpreadsheetIcon;
    } else if (presentationExtensions.includes(extension)) {
        return Presentation;
    } else if (archiveExtensions.includes(extension)) {
        return Archive;
    } else if (codeExtensions.includes(extension)) {
        return FileCodeIcon;
    } else if (audioExtensions.includes(extension)) {
        return FileAudioIcon;
    } else if (videoExtensions.includes(extension)) {
        return VideoIcon;
    } else if (pdfExtensions.includes(extension)) {
        return FileIcon;
    }

    // Default icon
    return FileIcon;
}

/**
 * Get the file type description based on extension
 * @param filename The filename or path
 * @returns A human-readable file type description
 */
export function getFileType(filename: string): string {
    if (!filename) return 'Unknown';

    const extension = filename.split('.').pop()?.toLowerCase() || '';

    if (imageExtensions.includes(extension)) {
        return 'Image';
    } else if (documentExtensions.includes(extension)) {
        return 'Document';
    } else if (spreadsheetExtensions.includes(extension)) {
        return 'Spreadsheet';
    } else if (presentationExtensions.includes(extension)) {
        return 'Presentation';
    } else if (archiveExtensions.includes(extension)) {
        return 'Archive';
    } else if (codeExtensions.includes(extension)) {
        return 'Code';
    } else if (audioExtensions.includes(extension)) {
        return 'Audio';
    } else if (videoExtensions.includes(extension)) {
        return 'Video';
    } else if (pdfExtensions.includes(extension)) {
        return 'PDF';
    }

    return 'File';
}

/**
 * Check if a file is of a particular type based on its extension
 * @param filename The filename or path
 * @param type The type to check for
 * @returns Boolean indicating if the file is of the specified type
 */
export function isFileType(filename: string, type: 'image' | 'document' | 'spreadsheet' | 'presentation' | 'archive' | 'code' | 'audio' | 'video' | 'pdf'): boolean {
    if (!filename) return false;

    const extension = filename.split('.').pop()?.toLowerCase() || '';

    switch (type) {
        case 'image':
            return imageExtensions.includes(extension);
        case 'document':
            return documentExtensions.includes(extension);
        case 'spreadsheet':
            return spreadsheetExtensions.includes(extension);
        case 'presentation':
            return presentationExtensions.includes(extension);
        case 'archive':
            return archiveExtensions.includes(extension);
        case 'code':
            return codeExtensions.includes(extension);
        case 'audio':
            return audioExtensions.includes(extension);
        case 'video':
            return videoExtensions.includes(extension);
        case 'pdf':
            return pdfExtensions.includes(extension);
        default:
            return false;
    }
}

/**
 * Get file size in a human-readable format
 * @param sizeInBytes File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(sizeInBytes: number): string {
    if (sizeInBytes < 1024) {
        return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
        return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else if (sizeInBytes < 1024 * 1024 * 1024) {
        return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    } else {
        return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
} 