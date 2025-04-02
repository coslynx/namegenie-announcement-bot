import { Client, Events } from 'discord.js';
import { Logger } from '../utils/Logger';

/**
 * Handles the 'ClientReady' event emitted by the discord.js client.
 * This event signifies that the bot has successfully connected to Discord
 * and is ready to start operating.
 */
export class ReadyEvent {
    /**
     * Executes the logic when the ClientReady event is emitted.
     * Logs a confirmation message including the bot's username and tag.
     *
     * @param {Client} client - The discord.js Client instance that has become ready.
     * @returns {void}
     */
    static execute(client: Client): void {
        // Robustness check: Ensure client.user is available.
        // While ClientReady guarantees the client is ready, accessing client.user
        // immediately might theoretically race if not handled carefully internally by the library,
        // though it's generally safe. This check adds an extra layer of safety.
        if (!client.user) {
            Logger.error('Client user is null or undefined in ReadyEvent execution.');
            // Potentially throw an error or handle this critical state if needed,
            // but logging and returning might be sufficient if startup can tolerate this.
            return;
        }

        const botTag: string = client.user.tag;
        const logMessage: string = `Ready! Logged in as ${botTag}`;

        Logger.info(logMessage);
    }
}