<div class="hero-icon" align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/bot.svg" width="100" />
</div>

<h1 align="center">
nome-announcement-bot
</h1>
<h4 align="center">A simple Discord bot that listens for an `!announce [Name]` command and replies with `Announcing [Name]!` in the same channel.</h4>
<h4 align="center">Developed with the software and tools below.</h4>
<div class="badges" align="center">
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6" alt="TypeScript">
  <img src="https://img.shields.io/badge/Runtime-Node.js%20v20+-43853D" alt="Node.js v20+">
  <img src="https://img.shields.io/badge/Library-discord.js%20v14-5865F2" alt="discord.js v14">
  <img src="https://img.shields.io/badge/Testing-Jest-C21325" alt="Jest">
  <img src="https://img.shields.io/badge/Linter-ESLint-4B32C3" alt="ESLint">
  <img src="https://img.shields.io/badge/Formatter-Prettier-F7B93E" alt="Prettier">
</div>
<div class="badges" align="center">
  <img src="https://img.shields.io/github/last-commit/coslynx/nome-announcement-bot?style=flat-square&color=5D6D7E" alt="git-last-commit" />
  <img src="https://img.shields.io/github/commit-activity/m/coslynx/nome-announcement-bot?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
  <img src="https://img.shields.io/github/languages/top/coslynx/nome-announcement-bot?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</div>

## 📑 Table of Contents
- 📍 Overview
- 📦 Features
- 📂 Structure
- 💻 Installation
- 🏗️ Usage
- 🌐 Hosting
- 📄 License
- 👏 Authors

## 📍 Overview
The `nome-announcement-bot` is a straightforward Minimum Viable Product (MVP) designed to perform a single task: listen for a specific command in a Discord channel and announce the provided name back into that same channel. It leverages Node.js and the `discord.js` library, written in TypeScript for type safety and maintainability. Its primary goal is simplicity and demonstrating the core bot functionality.

## 📦 Features
|    | Feature            | Description                                                                                                        |
|----|--------------------|--------------------------------------------------------------------------------------------------------------------|
| ⚙️ | **Architecture**   | Simple event-driven architecture using `discord.js`. Code is organized into event handlers, commands, and utilities for clarity. |
| 📄 | **Documentation**  | This README provides a comprehensive overview, setup instructions, usage details, and configuration guidance. Includes `commands.json` for command metadata. |
| 🔗 | **Dependencies**   | Core dependencies include `discord.js` for Discord API interaction and `dotenv` for environment variable management. Dev dependencies include TypeScript, Jest, ESLint, and Prettier. |
| 🧩 | **Modularity**     | Event handling (`Ready`, `MessageCreate`) and command logic (`AnnounceCommand`) are separated into distinct modules/classes. Includes a simple `Logger` utility. |
| 🧪 | **Testing**        | Includes unit tests for the `AnnounceCommand` using Jest, mocking dependencies like `discord.js` message objects and the Logger. |
| ⚡️  | **Performance**    | Lightweight and efficient due to its minimal scope. Performance relies mainly on the responsiveness of the Discord API and the `discord.js` library. |
| 🔐 | **Security**       | Relies on Discord's authentication via bot token. The token is managed securely using a `.env` file which MUST be kept private (added to `.gitignore`). Basic input validation prevents trivial command errors. |
| 🔀 | **Version Control**| Utilizes Git for version control. `package.json` tracks dependencies. |
| 🔌 | **Integrations**   | Directly integrates with the Discord Gateway API via the `discord.js` library to receive events and send messages. Requires specific Gateway Intents (`Guilds`, `GuildMessages`, `MessageContent`). |
| 📶 | **Scalability**    | As an MVP, scaling is handled by Discord's infrastructure. The bot itself is stateless and can be run in multiple instances if sharding becomes necessary (though overkill for this scope). |

## 📂 Structure
```text
.
├── .env                      # Environment variables (TOKEN - MUST BE GITIGNORED)
├── .gitignore                # Specifies intentionally untracked files by Git
├── README.md                 # This file
├── commands.json             # Metadata for bot commands
├── package.json              # Project metadata and dependencies
├── startup.sh                # Script to start the bot (dev/prod modes)
├── tsconfig.json             # TypeScript compiler configuration
├── src                       # Source code directory
│   ├── commands              # Command logic handlers
│   │   └── AnnounceCommand.ts
│   ├── events                # Discord event handlers
│   │   ├── MessageCreateEvent.ts
│   │   └── ReadyEvent.ts
│   ├── utils                 # Utility functions/classes
│   │   └── Logger.ts
│   └── index.ts              # Application entry point, client initialization
└── tests                     # Test files directory
    └── AnnounceCommand.test.ts
```

## 💻 Installation
  > [!WARNING]
  > ### 🔧 Prerequisites
  > - **Node.js:** Version `20.x` or higher (as specified in `package.json`).
  > - **npm:** Version included with Node.js (check with `npm -v`).
  > - **Discord Bot Token:** You need to create a Discord Application and Bot User via the [Discord Developer Portal](https://discord.com/developers/applications) to obtain a token.
  > - **Git:** Required for cloning the repository.

  ### 🚀 Setup Instructions
  1. Clone the repository:
     ```bash
     git clone https://github.com/coslynx/nome-announcement-bot.git
     cd nome-announcement-bot
     ```
  2. Install dependencies:
     ```bash
     npm install
     ```
  3. Configure environment variables:
     - Create a `.env` file in the project root directory.
     - Add your Discord Bot Token to the file:
       ```dotenv
       # .env
       DISCORD_BOT_TOKEN=your_discord_bot_token_here
       ```
     > [!WARNING]
     > **Never commit your `.env` file or share your bot token!** Ensure `.env` is listed in your `.gitignore` file.

## 🏗️ Usage
### 🏃‍♂️ Running the Bot

There are two main ways to run the bot: Development mode (with live reloading) and Production mode (compiled code).

**1. Development Mode:**
   - Uses `ts-node-dev` to run the TypeScript code directly and restart on file changes.
   - Ideal for active development and testing.
   ```bash
   npm run dev
   ```
   or using the startup script:
   ```bash
   ./startup.sh --dev
   ```

**2. Production Mode:**
   - Requires compiling the TypeScript code to JavaScript first.
   - Runs the compiled JavaScript code. Use this for stable deployments.
   ```bash
   # Step 1: Compile TypeScript to JavaScript (creates the 'dist' directory)
   npm run build

   # Step 2: Start the bot using the compiled code
   npm run start
   ```
   or using the startup script (which checks for the build):
   ```bash
   ./startup.sh
   ```

> [!TIP]
> ### ⚙️ Configuration
> - The primary configuration is the `DISCORD_BOT_TOKEN` in the `.env` file. This is essential for the bot to log in.
> - The command prefix is hardcoded as `!` in `src/events/MessageCreateEvent.ts`. You can modify it there if needed.
> - Required Discord Gateway Intents (`Guilds`, `GuildMessages`, `MessageContent`) are set during client initialization in `src/index.ts`. The `MessageContent` intent requires explicit enabling in the Discord Developer Portal for your bot after August 31, 2022.

### 📚 Examples
Using the bot in Discord:

- **Announce a name:**
  Type the following command in a channel where the bot is present and has permission to read and send messages:
  ```
  !announce John Doe
  ```
- **Bot Response:**
  The bot will reply in the same channel:
  ```
  Announcing John Doe!
  ```
- **Command without a name:**
  If you type only `!announce`:
  ```
  !announce
  ```
- **Bot Response:**
  The bot will prompt you to provide a name:
  ```
  Error: Please provide a name to announce!
  ```

## 🌐 Hosting
### 🚀 Deployment Instructions
This Node.js bot can be hosted on various platforms like Heroku, AWS EC2, Google Cloud, DigitalOcean Droplets, or even a personal server. Below are general guidelines:

**General Steps:**
1.  **Ensure Prerequisites:** The hosting environment must have Node.js (version 20.x+) and npm installed.
2.  **Upload Code:** Transfer the project files (excluding `node_modules` and `.env`) to the server.
3.  **Install Dependencies:** Navigate to the project directory on the server and run `npm install --omit=dev` to install only production dependencies.
4.  **Build Code:** Run `npm run build` to compile TypeScript to JavaScript (output in `dist/`).
5.  **Set Environment Variables:** Configure the `DISCORD_BOT_TOKEN` as an environment variable on the hosting platform. **Do not upload the `.env` file directly to production servers.** Use the platform's mechanism for managing secrets.
6.  **Start the Bot:** Run the bot using a process manager like `pm2` for reliability and restarts:
    ```bash
    # Install pm2 globally (if not already installed)
    npm install -g pm2

    # Start the bot using the compiled code
    pm2 start dist/index.js --name nome-announcement-bot
    ```
    Alternatively, use `npm start` within the process manager's configuration or directly if using simpler setups like systemd services.

**Example (Conceptual Heroku):**
1.  Use Heroku CLI.
2.  Create app: `heroku create your-bot-name`
3.  Set environment variable: `heroku config:set DISCORD_BOT_TOKEN=your_actual_token`
4.  Ensure `package.json` has correct `engines` and a `start` script.
5.  Ensure `npm run build` is part of the Heroku build process (often automatic for Node.js buildpacks if `build` script exists).
6.  Deploy: `git push heroku main`

> [!NOTE]
> Always consult the documentation of your chosen hosting provider for the best practices regarding Node.js application deployment and environment variable management.

### 🔑 Environment Variables
- `DISCORD_BOT_TOKEN`: **Required.** The authentication token for your Discord bot. Must be kept secret and set in the hosting environment.
  Example: `MTEyMzQ1Njc4OTAxMjM0NTY3OA.Gxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy`


> [!NOTE]
> ## 📜 License & Attribution
>
> ### 📄 License
> This Minimum Viable Product (MVP) is licensed under the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) license.
>
> ### 🤖 AI-Generated MVP
> This MVP was entirely generated using artificial intelligence through [CosLynx.com](https://coslynx.com).
>
> No human was directly involved in the coding process of the repository: nome-announcement-bot
>
> ### 📞 Contact
> For any questions or concerns regarding this AI-generated MVP, please contact CosLynx at:
> - Website: [CosLynx.com](https://coslynx.com)
> - Twitter: [@CosLynxAI](https://x.com/CosLynxAI)

<p align="center">
  <h1 align="center">🌐 CosLynx.com</h1>
</p>
<p align="center">
  <em>Create Your Custom MVP in Minutes With CosLynxAI!</em>
</p>
<div class="badges" align="center">
<img src="https://img.shields.io/badge/Developers-Drix10,_Kais_Radwan-red" alt="">
<img src="https://img.shields.io/badge/Website-CosLynx.com-blue" alt="">
<img src="https://img.shields.io/badge/Backed_by-Google,_Microsoft_&_Amazon_for_Startups-red" alt="">
<img src="https://img.shields.io/badge/Finalist-Backdrop_Build_v4,_v6-black" alt="">
</div>