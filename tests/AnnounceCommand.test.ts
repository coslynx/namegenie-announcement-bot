import { AnnounceCommand } from '../src/commands/AnnounceCommand';
import { Logger } from '../src/utils/Logger';
import { Message } from 'discord.js'; // Used for type casting mocks

// Mock the Logger utility to prevent console output during tests
// and allow verification of log calls.
jest.mock('../src/utils/Logger');

describe('AnnounceCommand', () => {
    let mockMessage: Partial<Message>; // Partial type for the mock Message object
    let mockSend: jest.Mock; // Mock function for message.channel.send

    beforeEach(() => {
        // Reset mocks before each test
        mockSend = jest.fn().mockResolvedValue({}); // Default to resolve successfully
        (Logger.info as jest.Mock).mockClear();
        (Logger.warn as jest.Mock).mockClear();
        (Logger.error as jest.Mock).mockClear();

        // Create a base mock Message object for each test
        // Use 'as any' for nested properties with methods to satisfy TS in a mock context
        mockMessage = {
            channel: {
                id: 'mockChannelId',
                send: mockSend,
            } as any,
            guild: { // Include basic guild info for potential logging context
                id: 'mockGuildId',
            } as any,
            author: { // Include basic author info for potential logging context
                tag: 'MockUser#0001',
            } as any,
        };
    });

    it('should send a correctly formatted announcement for a single word name', async () => {
        const args = ['TestName'];
        // Cast the partial mock to Message for the function call
        await AnnounceCommand.execute(mockMessage as Message, args);

        expect(mockSend).toHaveBeenCalledTimes(1);
        expect(mockSend).toHaveBeenCalledWith('Announcing TestName!');
        // Optionally check that no error was logged
        expect(Logger.error).not.toHaveBeenCalled();
    });

    it('should send a correctly formatted announcement for a multi-word name', async () => {
        const args = ['Multiple', 'Word', 'Name'];
        await AnnounceCommand.execute(mockMessage as Message, args);

        expect(mockSend).toHaveBeenCalledTimes(1);
        expect(mockSend).toHaveBeenCalledWith('Announcing Multiple Word Name!');
        expect(Logger.error).not.toHaveBeenCalled();
    });

    it('should correctly join arguments with spaces for the announcement', async () => {
        // This tests the behavior of args.join(' ') implicitly
        const args = ['Name', 'With', 'Spaces'];
        await AnnounceCommand.execute(mockMessage as Message, args);

        expect(mockSend).toHaveBeenCalledTimes(1);
        expect(mockSend).toHaveBeenCalledWith('Announcing Name With Spaces!');
        expect(Logger.error).not.toHaveBeenCalled();
    });

    it('should log an error if sending the message fails', async () => {
        const args = ['FailTest'];
        const testError = new Error('Simulated Discord API Error: Missing Permissions');

        // Configure the mock send function to reject for this specific test
        mockSend.mockRejectedValueOnce(testError);

        await AnnounceCommand.execute(mockMessage as Message, args);

        // Verify send was still called with the expected message attempt
        expect(mockSend).toHaveBeenCalledTimes(1);
        expect(mockSend).toHaveBeenCalledWith('Announcing FailTest!');

        // Verify that Logger.error was called exactly once
        expect(Logger.error).toHaveBeenCalledTimes(1);

        // Verify Logger.error was called with the expected error message format and the error object
        expect(Logger.error).toHaveBeenCalledWith(
            expect.stringContaining(`Failed to send announcement message for "FailTest" in channel ${mockMessage.channel?.id}`),
            testError // Check that the original error object was passed to the logger
        );
    });

    // Optional: Test for success logging if implemented in AnnounceCommand
    // it('should log an informational message on successful announcement', async () => {
    //     const args = ['SuccessLog'];
    //     await AnnounceCommand.execute(mockMessage as Message, args);

    //     expect(mockSend).toHaveBeenCalledTimes(1);
    //     expect(mockSend).toHaveBeenCalledWith('Announcing SuccessLog!');
    //     // Check if Logger.info was called (assuming it's implemented for success)
    //     expect(Logger.info).toHaveBeenCalledWith(
    //         expect.stringContaining(`Successfully announced "SuccessLog"`) // Adjust based on actual log message
    //     );
    //     expect(Logger.error).not.toHaveBeenCalled();
    // });
});