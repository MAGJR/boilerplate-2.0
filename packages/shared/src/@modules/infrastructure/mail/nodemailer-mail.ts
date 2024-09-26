import { createTransport, Transporter } from 'nodemailer'
import { error, log } from '../../interfaces/core/log'
import { IMailProvider, SendMailParams } from '../../interfaces/providers/mail'

/**
 * NodeMailerMailProvider is a class that implements the IMailProvider interface.
 * It is responsible for sending emails using the Nodemailer library.
 */
export class NodeMailerMailProvider implements IMailProvider {
  /**
   * The transporter object created by Nodemailer.
   */
  private transporter: Transporter

  /**
   * Initializes the NodeMailerMailProvider with a transporter object.
   * The transporter is created using the SMTP_EMAIL_SERVER environment variable.
   */
  constructor() {
    log({ provider: 'NodeMailerMailProvider', message: 'Initializing' })
    this.transporter = createTransport(process.env.SMTP_EMAIL_SERVER)
    log({ provider: 'NodeMailerMailProvider', message: 'Transporter created' })
  }

  /**
   * Sends an email using the transporter.
   * @param {SendMailParams} params - The parameters for sending the email.
   * @returns {Promise<void>} A Promise that resolves when the email is sent.
   * @throws {Error} If there's an error sending the email.
   */
  async send({ from, to, subject, body }: SendMailParams): Promise<void> {
    log({ provider: 'NodeMailerMailProvider', message: 'Sending email' })
    try {
      await this.transporter.sendMail({
        from,
        to,
        subject,
        html: body,
      })

      log({
        provider: 'NodeMailerMailProvider',
        message: 'Email sent successfully',
      })
    } catch (err) {
      error({
        provider: 'NodeMailerMailProvider',
        message: 'Error sending email',
        data: err,
      })
      throw err
    }
  }
}
