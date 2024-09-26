/**
 * Represents a storage provider interface.
 */
export interface IStorageProvider {
  /**
   * Uploads a file to a specific context and returns the path.
   * @param context The context in which the file is being uploaded (e.g., 'tenants', 'users', 'shared').
   * @param id The unique identifier for the context (e.g., tenant ID, user ID).
   * @param file The file to be uploaded.
   * @returns A Promise that resolves to the path of the uploaded file.
   */
  upload: (
    context: 'tenants' | 'users' | 'shared',
    id: string,
    file: File,
  ) => Promise<string>

  /**
   * Deletes a file at the specified path.
   * @param path The path of the file to be deleted.
   * @returns A Promise that resolves when the file is deleted.
   */
  delete: (path: string) => Promise<void>

  /**
   * Lists all files in a specific context.
   * @param context The context in which to list files (e.g., 'tenants', 'users', 'shared').
   * @param id The unique identifier for the context (e.g., tenant ID, user ID).
   * @returns A Promise that resolves to an array of file paths.
   */
  listFiles: (
    context: 'tenants' | 'users' | 'shared',
    id: string,
  ) => Promise<string[]>

  /**
   * Deletes all files in a specific context.
   * @param context The context in which to delete files (e.g., 'tenants', 'users', 'shared').
   * @param id The unique identifier for the context (e.g., tenant ID, user ID).
   * @returns A Promise that resolves when all files are deleted.
   */
  deleteAllFiles: (
    context: 'tenants' | 'users' | 'shared',
    id: string,
  ) => Promise<void>
}
