import chalk from 'chalk'

/**
 * Interface representing the context for logging.
 */
interface LogContext {
  /** The provider or source of the log. */
  provider: string
  /** The main message to be logged. */
  message: string
  /** Optional additional data to be logged. */
  data?: unknown
  /** Optional timestamp for the log entry. */
  timestamp?: string
  /** Optional log level. */
  level?: 'log' | 'error' | 'warn' | 'debug' | 'verbose'
  /** Optional context information. */
  context?: string
}

/**
 * Logger class for handling different types of log messages.
 */
class Logger {
  /**
   * Formats a log message with color and structure.
   * @param context - The logging context.
   * @returns A formatted log message string.
   */
  private static formatLogMessage(context: LogContext): string {
    const { provider, message, data, timestamp, level, context: ctxt } = context
    const formattedTimestamp = timestamp || new Date().toISOString()
    const formattedLevel = level ? level.toUpperCase() : 'LOG'
    const formattedContext = ctxt ? `[${ctxt}] ` : ''

    let logMessage = `${chalk.gray(formattedTimestamp)} ${this.getColoredLevel(
      formattedLevel,
    )} ${chalk.yellow(provider)} ${formattedContext}${message}`

    if (data) {
      const dataString = JSON.stringify(data, null, 2)
      logMessage += '\n' + chalk.gray(dataString)
    }

    return logMessage
  }

  /**
   * Returns a colored string for the log level.
   * @param level - The log level.
   * @returns A chalk-colored string representing the log level.
   */
  private static getColoredLevel(level: string): string {
    const colors: Record<string, chalk.Chalk> = {
      ERROR: chalk.red,
      WARN: chalk.yellow,
      DEBUG: chalk.blue,
      VERBOSE: chalk.magenta,
      LOG: chalk.green,
    }
    return (colors[level] || chalk.green)(level)
  }

  /**
   * Creates a logger function with a default log level.
   * @param defaultLevel - The default log level for the created logger.
   * @returns A function that logs messages with the specified default level.
   */
  private static createLogger(defaultLevel: LogContext['level']) {
    return (context: Omit<LogContext, 'level'>): void => {
      const logFunction =
        defaultLevel && defaultLevel in console
          ? (console[defaultLevel as keyof Console] as (...data: any[]) => void)
          : console.log
      logFunction(this.formatLogMessage({ ...context, level: defaultLevel }))
    }
  }

  /** Logger for general log messages. */
  public static log = Logger.createLogger('log')
  /** Logger for error messages. */
  public static error = Logger.createLogger('error')
  /** Logger for warning messages. */
  public static warn = Logger.createLogger('warn')
  /** Logger for debug messages. */
  public static debug = Logger.createLogger('debug')
  /** Logger for verbose messages. */
  public static verbose = Logger.createLogger('verbose')
}

export const { log, error, warn, debug, verbose } = Logger
