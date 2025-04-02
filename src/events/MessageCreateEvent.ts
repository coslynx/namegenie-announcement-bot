import { Message, Events } from 'discord.js';
import { AnnounceCommand } from '../commands/AnnounceCommand';
import { Logger } from '../utils/Logger';

// Define the prefix required for commands intended for this bot.
const COMMAND_PREFIX = '!';

/**
 * Handles the 'messageCreate' event emitted by the discord.js client.
 * This event signifies that a new message has been created in a channel
 * the bot has access to. This handler is responsible for parsing potential commands,
 * validating them, and routing them to the appropriate command logic.
 */
export class MessageCreateEvent {
    /**
     * Executes the logic when the MessageCreate event is emitted.
     * It checks if the message is a potential command, validates its structure,
     * and delegates execution to the corresponding command handler.
     * For the MVP, it only handles the '!announce' command.
     *
     * @param {Message} message - The discord.js Message object that was created.
     * @returns {Promise<void>} A promise that resolves when handling is complete.
     */
    static async execute(message: Message): Promise<void> {
        // 1. Bot Check: Ignore messages from bots (including self) to prevent loops.
        // Although index.ts might also check this, having it here ensures encapsulation.
        if (message.author.bot) {
            // Optional: Log for debugging if needed, but generally not required.
            // Logger.info(`Ignoring message from bot: ${message.author.tag} in channel ${message.channel.id}`);
            return;
        }

        // 2. Prefix Check: Ensure the message starts with the defined command prefix.
        if (!message.content.startsWith(COMMAND_PREFIX)) {
            return; // Not a command intended for this bot.
        }

        // 3. Argument Parsing:
        // Slice the prefix and split the rest by whitespace. Allows for multiple spaces between args.
        const args: string[] = message.content.slice(COMMAND_PREFIX.length).trim().split(/\s+/);
        // The first part is the command name, converted to lowercase for case-insensitivity.
        const commandName: string | undefined = args.shift()?.toLowerCase();

        // If there's no command name after the prefix, ignore.
        if (!commandName) {
            // Logger.info(`Ignoring message with prefix but no command: ${message.author.tag}`);
            return;
        }

        // 4. Command Routing (MVP: Only 'announce')
        if (commandName === 'announce') {
            // 4a. Argument Validation for 'announce'
            if (args.length === 0) {
                const errorMessage = 'Error: Please provide a name to announce!';
                try {
                    await message.reply(errorMessage);
                } catch (replyError) {
                    Logger.error(
                        `Failed to send missing arguments reply for !announce in channel ${message.channel.id} (Guild: ${message.guild?.id})`,
                        replyError
                    );
                }
                return; // Stop processing after sending the error reply.
            }

            // 4b. Execute 'announce' command
            try {
                // Delegate execution to the AnnounceCommand handler.
                // It assumes args is non-empty based on the check above.
                await AnnounceCommand.execute(message, args);
            } catch (commandError) {
                // Catch potential synchronous or asynchronous errors from the command execution itself.
                Logger.error(
                    `Error executing AnnounceCommand for \"${args.join(' ')}\" initiated by ${message.author.tag} in channel ${message.channel.id} (Guild: ${message.guild?.id})`,
                    commandError
                );
                // Optionally, inform the user about the internal error
                try {
                    await message.reply('Sorry, an internal error occurred while trying to announce.');
                } catch (internalErrorReplyError) {
                    Logger.error(
                        `Failed to send internal error reply after AnnounceCommand failure in channel ${message.channel.id} (Guild: ${message.guild?.id})`,
                        internalErrorReplyError
                    );
                }
            }
        } else {
            // 5. Unknown Command (MVP: Ignore silently)
            // For future extension, could reply with "Unknown command" or log it.
            // Logger.info(`Unknown command received: ${commandName} from ${message.author.tag}`);
            return;
        }
    }
}