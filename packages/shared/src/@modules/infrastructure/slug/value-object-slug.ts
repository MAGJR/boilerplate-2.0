import { log } from '../../interfaces/core/log'

/**
 * A value object for generating slugs.
 */
export class SlugValueObject {
  /**
   * The value of the slug.
   */
  public value: string

  /**
   * Initializes the SlugValueObject with a value.
   * @param value The value of the slug.
   */
  constructor(value: string) {
    this.value = value
    log({
      provider: 'SlugValueObject',
      message: 'Initialized',
      data: { value },
      context: 'constructor',
    })
  }

  /**
   * Creates a slug from a text.
   * @param text The text to create the slug from.
   * @param addRandomByte Whether to add a random byte to the slug.
   * @returns The created slug.
   */
  static createFromText(text: string, addRandomByte = true): string {
    log({
      provider: 'SlugValueObject',
      message: 'Creating slug from text',
      data: { text, addRandomByte },
      context: 'createFromText',
    })
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s_-]/g, '') // Include hyphen in the list of allowed characters
      .replace(/\s+/g, '-') // spaces replaced by hyphen
      .replace(/_+/g, '-') // underscores replaced by hyphen
      .replace(/-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')

    if (!addRandomByte) return slugText

    const randomByDate = new Date().getTime().toString(36)
    return `${slugText}-${randomByDate}`
  }

  /**
   * Creates a slug from an email.
   * @param email The email to create the slug from.
   * @returns The created slug.
   */
  static createFromEmail(email: string): string {
    log({
      provider: 'SlugValueObject',
      message: 'Creating slug from email',
      data: { email },
      context: 'createFromEmail',
    })
    const username = email.split('@')[0]
    const slug = SlugValueObject.createFromText(username)
    log({
      provider: 'SlugValueObject',
      message: 'Slug created from email',
      data: { email, createdSlug: slug },
      context: 'createFromEmail',
    })
    return slug
  }
}
