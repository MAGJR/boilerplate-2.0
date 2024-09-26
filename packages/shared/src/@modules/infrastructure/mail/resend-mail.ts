import { Resend } from 'resend'
import { error, log } from '../../interfaces/core/log'
import { IMailProvider, SendMailParams } from '../../interfaces/providers/mail'

/**
 * ResendProvider is a class that implements the IMailProvider interface.
 * It is responsible for sending emails using the Resend API.
 */
export class ResendProvider implements IMailProvider {
  /**
   * The Resend client instance.
   */
  private client: Resend

  /**
   * Initializes the ResendProvider with a Resend client instance.
   * The client is created using the RESEND_API_KEY environment variable.
   */
  constructor() {
    log({ provider: 'ResendProvider', message: 'Initializing' })
    this.client = new Resend(process.env.RESEND_API_KEY ?? '123')
    log({ provider: 'ResendProvider', message: 'Initialized' })
  }

  /**
   * Sends an email using the Resend API.
   * @param {SendMailParams} params - The parameters for sending the email.
   * @returns {Promise<void>} A Promise that resolves when the email is sent.
   * @throws {Error} If there's an error sending the email.
   */
  async send(params: SendMailParams): Promise<void> {
    log({ provider: 'ResendProvider', message: 'Sending email' })

    try {
      await this.client.emails.create({
        to: params.to,
        from: params.from,
        subject: params.subject,
        html: params.body,
      })
      log({ provider: 'ResendProvider', message: 'Email sent successfully' })
    } catch (err) {
      error({
        provider: 'ResendProvider',
        message: 'Error sending email',
        data: err,
      })
      throw err
    }
  }
}
