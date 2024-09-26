import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import axios, { AxiosInstance } from 'axios'
import { randomUUID } from 'crypto'
import { log } from '../../interfaces/core/log'
import { IStorageProvider } from '../../interfaces/providers/storage'

interface S3StorageConfig {
  endpoint: string
  region: string
  bucket: string
  accessKeyId: string
  secretAccessKey: string
  storagePath: string
}

/**
 * Implements the IStorageProvider interface to interact with AWS S3 for file storage with contextual management.
 */
export class S3StorageProvider implements IStorageProvider {
  private client: S3Client
  private httpClient: AxiosInstance
  private config: S3StorageConfig

  /**
   * Initializes the S3StorageProvider with an S3 client and an HTTP client.
   */
  constructor() {
    log({ provider: 'S3StorageProvider', message: 'Initializing' })
    this.config = this.initConfig()
    this.client = new S3Client({
      endpoint: this.config.endpoint,
      region: this.config.region,
      apiVersion: 'latest',
      tls: false, // Ignore SSL
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    })

    this.httpClient = axios.create()
    log({ provider: 'S3StorageProvider', message: 'Initialized' })
  }

  private initConfig(): S3StorageConfig {
    return {
      endpoint: process.env.STORAGE_ENDPOINT || '',
      region: process.env.STORAGE_REGION || 'ny3',
      bucket: process.env.STORAGE_BUCKET || '',
      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || '',
      storagePath: process.env.STORAGE_PATH || '',
    }
  }

  private ensureTrailingSlash(path: string): string {
    return path.endsWith('/') ? path : `${path}/`
  }

  /**
   * Converts a File object to a Buffer.
   *
   * @param file The File object to convert.
   * @returns A Promise that resolves to the Buffer representation of the file.
   */
  private async convertFileToBuffer(file: File) {
    log({
      provider: 'S3StorageProvider',
      message: 'Converting file to buffer',
      data: { fileName: file.name },
      context: 'convertFileToBuffer',
    })
    const stream = file.stream()
    const chunks = []

    for await (const chunk of stream as any) {
      chunks.push(chunk)
    }

    log({
      provider: 'S3StorageProvider',
      message: 'File converted to buffer',
      data: { fileName: file.name, bufferSize: Buffer.concat(chunks).length },
      context: 'convertFileToBuffer',
    })
    return Buffer.concat(chunks)
  }

  /**
   * Uploads a file to AWS S3 in a specific context.
   *
   * @param context The context in which the file is being uploaded (e.g., 'tenants', 'users', 'shared').
   * @param id The unique identifier for the context (e.g., tenant ID, user ID).
   * @param file The File object to upload.
   * @returns A Promise that resolves to the full path of the uploaded file.
   */
  async upload(
    context: 'tenants' | 'users' | 'shared',
    id: string,
    file: File,
  ): Promise<string> {
    log({
      provider: 'S3StorageProvider',
      message: `Uploading file`,
      data: { context, id, fileName: file.name },
      context: 'upload',
    })
    const basePath = this.ensureTrailingSlash(
      `${this.config.storagePath}${context}/${id}`,
    )
    const extension = file.name.split('.').pop()
    const buffer = await this.convertFileToBuffer(file)
    const fileName = randomUUID() + '.' + extension
    const filePath = basePath + fileName

    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: filePath,
      Body: buffer,
      CacheControl: 'max-age=31536000',
      ACL: 'public-read',
    })

    await this.client.send(command)

    log({
      provider: 'S3StorageProvider',
      message: `File uploaded successfully`,
      data: { filePath },
      context: 'upload',
    })
    return `${this.ensureTrailingSlash(this.config.endpoint)}${
      this.config.bucket
    }/${filePath}`
  }

  /**
   * Deletes a file from AWS S3.
   *
   * @param path The path of the file to delete.
   * @returns A Promise that resolves when the file is deleted.
   */
  async delete(path: string): Promise<void> {
    log({
      provider: 'S3StorageProvider',
      message: 'Deleting file',
      data: { path },
      context: 'delete',
    })
    const key = path.replace(
      `${this.ensureTrailingSlash(this.config.endpoint)}${this.config.bucket}/`,
      '',
    )

    const command = new DeleteObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    })

    await this.client.send(command)
    log({
      provider: 'S3StorageProvider',
      message: 'File deleted successfully',
      data: { path },
      context: 'delete',
    })
  }

  /**
   * Lists all files in a specific context.
   *
   * @param context The context in which to list files (e.g., 'tenants', 'users', 'shared').
   * @param id The unique identifier for the context (e.g., tenant ID, user ID).
   * @returns A Promise that resolves to an array of file paths.
   */
  async listFiles(
    context: 'tenants' | 'users' | 'shared',
    id: string,
  ): Promise<string[]> {
    log({
      provider: 'S3StorageProvider',
      message: 'Listing files',
      data: { context, id },
      context: 'listFiles',
    })
    const basePath = this.ensureTrailingSlash(
      `${this.config.storagePath}${context}/${id}`,
    )

    const command = new ListObjectsV2Command({
      Bucket: this.config.bucket,
      Prefix: basePath,
    })

    const response = await this.client.send(command)
    const files =
      response.Contents?.map(
        (item) =>
          `${this.ensureTrailingSlash(this.config.endpoint)}${
            this.config.bucket
          }/${item.Key}`,
      ) || []
    log({
      provider: 'S3StorageProvider',
      message: 'Files listed successfully',
      data: { fileCount: files.length },
      context: 'listFiles',
    })
    return files
  }

  /**
   * Deletes all files in a specific context.
   *
   * @param context The context in which to delete files (e.g., 'tenants', 'users', 'shared').
   * @param id The unique identifier for the context (e.g., tenant ID, user ID).
   * @returns A Promise that resolves when all files are deleted.
   */
  async deleteAllFiles(
    context: 'tenants' | 'users' | 'shared',
    id: string,
  ): Promise<void> {
    log({
      provider: 'S3StorageProvider',
      message: 'Deleting all files',
      data: { context, id },
      context: 'deleteAllFiles',
    })
    const files = await this.listFiles(context, id)

    for (const file of files) {
      const key = file.replace(
        `${this.ensureTrailingSlash(this.config.endpoint)}${
          this.config.bucket
        }/`,
        '',
      )
      const command = new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      })

      await this.client.send(command)
    }
    log({
      provider: 'S3StorageProvider',
      message: 'All files deleted successfully',
      data: { deletedFileCount: files.length },
      context: 'deleteAllFiles',
    })
  }
}
