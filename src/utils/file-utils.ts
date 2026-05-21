/**
 * File utilities for Printify MCP
 */
import * as fs from 'fs';
import * as path from 'path';

/**
 * Ensure a directory exists, creating it if necessary
 */
export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.error(`Created directory: ${dirPath}`);
  }
}

/**
 * Generate a temporary file path
 */
export function generateTempFilePath(
  baseDir: string,
  fileName: string,
  extension: string = 'png'
): string {
  // Ensure the directory exists
  ensureDirectoryExists(baseDir);

  // Generate a unique filename with timestamp
  const uniqueFileName = `${Date.now()}_${fileName}.${extension}`;
  return path.resolve(path.join(baseDir, uniqueFileName));
}

/**
 * Clean up temporary files
 */
export function cleanupFiles(filePaths: string[]): void {
  filePaths.forEach(filePath => {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.error(`Cleaned up file: ${filePath}`);
      } catch (error) {
        console.error(`Error cleaning up file ${filePath}:`, error);
      }
    }
  });
}

/**
 * Validate that a file path is within an allowed base directory.
 * Prevents path traversal attacks from reaching sensitive files.
 */
export function validateFilePath(filePath: string, operation: 'read' | 'write'): string {
  const baseDir = process.env.ALLOWED_FILE_DIR || process.cwd();
  const resolved = path.resolve(filePath);
  const resolvedBase = path.resolve(baseDir);

  if (!resolved.startsWith(resolvedBase + path.sep) && resolved !== resolvedBase) {
    throw new Error(
      `File ${operation} denied: path "${resolved}" is outside the allowed directory "${resolvedBase}". ` +
      `Set the ALLOWED_FILE_DIR environment variable to change the allowed directory.`
    );
  }

  return resolved;
}

/**
 * Get file information
 */
export function getFileInfo(filePath: string): { exists: boolean; size?: number; stats?: fs.Stats } {
  if (!filePath) {
    return { exists: false };
  }

  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    return {
      exists: true,
      size: stats.size,
      stats
    };
  }

  return { exists: false };
}
