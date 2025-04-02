import { Message } from 'discord.js';
import { Logger } from '../utils/Logger';

/**
 * Handles the execution of the '!announce' command.
 * Takes the provided arguments, formats them into an announcement message,
 * and sends it back to the originating channel.
 */
export class AnnounceCommand {
    /**
     * Executes the announce command logic.
     *
     * @param message - The discord.js Message object that triggered the command.
     * @param args - An array of strings representing the arguments provided after the command (expected to be the name).
     * @returns {Promise<void>} A promise that resolves once the operation is complete or an error is logged.
     */
    static async execute(message: Message, args: string[]): Promise<void> {
        // Note: Primary argument validation (checking if args is empty)
        // is expected to happen in the MessageCreateEvent handler before calling this.
        // This command assumes 'args' is a non-empty array.

        const nameToAnnounce: string = args.join(' ');
        const announcementMessage: string = `Announcing ${nameToAnnounce}!`;

        try {
            await message.channel.send(announcementMessage);
            // Optionally log successful execution if needed
            // Logger.info(`Successfully announced "${nameToAnnounce}" in channel ${message.channel.id}`);
        } catch (error) {
            // Log the error if sending the message fails
            // Common reasons include: missing permissions, channel deleted, network issues.
            Logger.error(
                `Failed to send announcement message for "${nameToAnnounce}" in channel ${message.channel.id} (Guild: ${message.guild?.id})`,
                error
            );
            // Do not attempt to reply to the user about this failure,
            // as the ability to send messages is likely compromised.
        }
    }
}