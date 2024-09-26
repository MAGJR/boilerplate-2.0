/**
 * Represents the parameters required to send an email.
 * @property {string} from - The email address of the sender.
 * @property {string} to - The email address of the recipient.
 * @property {string} subject - The subject of the email.
 * @property {string} body - The body of the email.
 */
export interface SendMailParams {
  from: string
  to: string
  subject: string
  body: string
}

/**
 * Defines the interface for a mail provider.
 * @property {(params: SendMailParams) => Promise<void>} send - A method to send an email.
 */
export interface IMailProvider {
  send: (params: SendMailParams) => Promise<void>
}
