/**
 * Logger Utility Class
 *
 * Provides a simple, standardized logging interface wrapping the native Node.js console.
 * It formats messages with timestamps and log levels.
 *
 * IMPORTANT SECURITY NOTE:
 * Ensure that sensitive information (e.g., passwords, API keys, tokens, personally identifiable information)
 * is NEVER passed directly into log messages by the calling code.
 * Sanitize or redact sensitive data before logging.
 */
export class Logger {
    /**
     * Logs an informational message.
     * Output is directed to `console.info` (or `console.log`).
     *
     * @param {string} message - The main message string to log.
     * @param {...any[]} optionalParams - Additional parameters to pass to the console method.
     */
    static info(message: string, ...optionalParams: any[]): void {
        const timestamp = new Date().toISOString();
        const level = '[INFO]';
        const formattedMessage = `[${timestamp}] ${level}: ${message}`;
        console.info(formattedMessage, ...optionalParams);
    }

    /**
     * Logs a warning message.
     * Output is directed to `console.warn`.
     *
     * @param {string} message - The main message string to log.
     * @param {...any[]} optionalParams - Additional parameters to pass to the console method.
     */
    static warn(message: string, ...optionalParams: any[]): void {
        const timestamp = new Date().toISOString();
        const level = '[WARN]';
        const formattedMessage = `[${timestamp}] ${level}: ${message}`;
        console.warn(formattedMessage, ...optionalParams);
    }

    /**
     * Logs an error message.
     * Handles `Error` objects by logging their stack trace if available.
     * Output is directed to `console.error`.
     *
     * @param {string | Error} message - The main message string or an Error object to log.
     * @param {...any[]} optionalParams - Additional parameters to pass to the console method, often used for context or related error objects.
     */
    static error(message: string | Error, ...optionalParams: any[]): void {
        const timestamp = new Date().toISOString();
        const level = '[ERROR]';
        let primaryLog: string;
        let detailsToLog: any[] = optionalParams;

        if (message instanceof Error) {
            // If the primary message is an Error object, format it and potentially log its stack.
            // Combine the error message with the base format.
            primaryLog = `[${timestamp}] ${level}: ${message.message}`;
            // Pass the stack as the first optional param if available, otherwise the error object itself.
            // Prepend any existing optionalParams after the error stack/object.
            detailsToLog = [message.stack || message, ...optionalParams];
        } else {
            // If the primary message is a string, format it normally.
            primaryLog = `[${timestamp}] ${level}: ${message}`;
        }

        console.error(primaryLog, ...detailsToLog);
    }
}