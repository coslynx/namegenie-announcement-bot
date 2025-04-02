import { config } from 'dotenv';
import { Client, Events, GatewayIntentBits, Message } from 'discord.js';
import { ReadyEvent } from './events/ReadyEvent';
import { MessageCreateEvent } from './events/MessageCreateEvent';
import { Logger } from './utils/Logger';

// Load environment variables from .env file
config();

// --- Token Validation ---
const DISCORD_BOT_TOKEN: string | undefined = process.env.DISCORD_BOT_TOKEN;

if (!DISCORD_BOT_TOKEN || DISCORD_BOT_TOKEN.trim() === '') {
    Logger.error('FATAL: DISCORD_BOT_TOKEN is missing or empty in the .env file.');
    Logger.error('Please ensure the .env file exists in the project root and contains a valid DISCORD_BOT_TOKEN.');
    process.exit(1); // Terminate immediately if the token is invalid
}

Logger.info('DISCORD_BOT_TOKEN loaded successfully.');

// --- Discord Client Initialization ---
Logger.info('Initializing Discord Client...');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Required for guild information
        GatewayIntentBits.GuildMessages, // Required to receive messages in guilds
        GatewayIntentBits.MessageContent, // Required to read the content of messages (for commands)
    ],
});
Logger.info('Discord Client initialized with required Gateway Intents.');

// --- Event Handler Registration ---

// Register the ReadyEvent handler - Executes once when the client is ready
client.once(Events.ClientReady, (readyClient: Client) => {
    // Pass the ready client instance to the handler
    try {
        Logger.info(`Registering ${Events.ClientReady} event handler.`);
        ReadyEvent.execute(readyClient);
    } catch (error) {
        // Although unlikely for a simple ready handler, catch potential synchronous errors
        Logger.error(`Error executing ReadyEvent handler during registration or initial execution:`, error);
        // Depending on the severity, consider exiting if ReadyEvent setup is critical
        // process.exit(1);
    }
});

// Register the MessageCreateEvent handler - Executes every time a message is created
client.on(Events.MessageCreate, async (message: Message) => {
    // Prevent processing messages from other bots to avoid loops
    if (message.author.bot) {
        return;
    }
    try {
        // Pass the received message object to the handler
        // The handler itself should contain the logic to parse and react to commands
        await MessageCreateEvent.execute(message);
    } catch (error) {
        // Catch and log any unhandled errors from the MessageCreateEvent handler
        Logger.error('Unhandled error executing MessageCreateEvent handler:', error);
        // Optionally, notify the user or a monitoring channel about the error
        // try {
        //     await message.reply('An internal error occurred while processing your command. Please try again later.');
        // } catch (replyError) {
        //     Logger.error('Failed to send error reply to user:', replyError);
        // }
    }
});

Logger.info(`Registered ${Events.ClientReady} and ${Events.MessageCreate} event handlers.`);

// --- Bot Login ---
Logger.info('Attempting to log in to Discord...');
client.login(DISCORD_BOT_TOKEN)
    .then(() => {
        // Login successful, the 'ready' event will fire next.
        // Logging confirmation here might be slightly premature as 'ready' is the true confirmation.
        // Logger.info('Login promise resolved successfully.'); // Optional: Log successful promise resolution
    })
    .catch((error: Error) => {
        // Handle potential login errors (e.g., invalid token, network issues)
        Logger.error('FATAL: Failed to log in to Discord. Please check the DISCORD_BOT_TOKEN and network connectivity.');
        Logger.error('Login Error Details:', error);
        process.exit(1); // Terminate immediately on login failure
    });

// Graceful shutdown handling (Optional but recommended)
process.on('SIGINT', () => {
    Logger.info('SIGINT received. Shutting down gracefully...');
    client.destroy(); // Close Discord connection
    process.exit(0);
});

process.on('SIGTERM', () => {
    Logger.info('SIGTERM received. Shutting down gracefully...');
    client.destroy();
    process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
    Logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Consider exiting or implementing more robust error handling/reporting
});

process.on('uncaughtException', (error) => {
    Logger.error('Uncaught Exception:', error);
    // It's generally recommended to exit after an uncaught exception
    process.exit(1);
});