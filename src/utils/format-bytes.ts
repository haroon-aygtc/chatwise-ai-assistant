/**
 * Formats a byte value into a human-readable string
 * @param bytes Number of bytes to format
 * @param decimals Number of decimal places to include
 * @returns Formatted string (e.g., "1.5 KB", "3.2 MB")
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
} 