# JazzRadio

![NodeJS](https://img.shields.io/badge/NodeJS-18-green.svg)
![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue.svg)

## Overview

JazzRadio Bot is a Discord bot that streams smooth jazz music in voice channels.
It supports various commands such as `/play`, `/stop`, `/leave`, `/info`, `/vote`, and `/help`.
The bot also features a rotating activity status to keep things lively.

You can find this bot **[here](https://top.gg/bot/955048681025978438)**, or you can invite it from **[here](https://discord.com/api/oauth2/authorize?client_id=968211299043536976&permissions=277028895808&scope=bot%20applications.commands)**.

Execute `/help` of the bot to view all available commands!

## 🌟 Features

- **Play Music**: Stream smooth jazz in voice channels.
- **Status Rotation**: Rotates activity status messages.
- **Command Handling**: Includes commands for playing, stopping, leaving, and more.
- **24/7**: Bot keeps playing the Jazz all day / night long.
- **Error Logging**: All errors are kept in an error.log file for you to inspect.
- Auto-Rejoin: Automatically rejoins the voice channel when restarting or crashing.

## 🚀 Requirements

- **Node.js**: Version 18.x or later.
- **Discord.js**: Version 14.x or later.
- **@discordjs/voice**: For voice-related features.

## ⚙️ Installation

1. **Clone the Repository**

```bash
  git clone https://github.com/ExceptedPrism3/JazzRadio.git
  cd JazzRadio
```

2. **Install Dependencies**

⚠️ **Ensure you have Node.js installed.** Then run:

```bash
  npm install
```

3. **Configuration**

Create a `.env` file in the root directory (you can rename the `.env.example` to `.env`) and fill in the required values:

```
TOKEN=YOUR_DISCORD_BOT_TOKEN
CLIENT_ID=YOUR_CLIENT_ID
VOTE_LINK=YOUR_BOT_VOTE_LINK
INVITE_LINK=YOUR_BOT_INVITE_LINK
STATUS_MESSAGES=Playing smooth jazz,Streaming 24/7,Chill vibes only
STATUS_INTERVAL=60000
```

Replace the placeholders with the appropriate information.

4. **Register Commands**

Run the following command to register your bot's commands while being the project root:

```bash
  node utils/deploy-commands.js
```

## 🕹️ Usage

1. **Start the Bot**

```bash
  node index.js
```

2. **Commands**

    Use the commands from the `/help` command

## 🤝 Contributing

1. **Fork the Repository**

    Create a fork of this repository to make changes.

2. **Clone your Work**

```bash
  git clone https://github.com/ExceptedPrism3/JazzrRdio.git
  cd JazzRadio
```

3. **Create a Branch**

```bash
  git checkout -b your-feature-branch
```

4. **Make Changes**

    Implement your feature or fix.

5. **Commit Changes**

```bash
  git add .
  git commit -m "Add your commit message here"
```

6. **Push the Changes**

```bash
  git push origin your-feature-branch
```

7. **Create a Pull Request**

    Submit a pull request with your changes.

## 📄 License

This project is licensed under the MIT License - see the **[LICENSE](LICENSE)** file for details.

## ✉️ Contact

For any questions or feedback, please reach out over the **[Discord Support Server](https://discord.com/invite/MfR5mcpVfX)** or open an **[Issue](https://github.com/ExceptedPrism3/JazzRadio/issues)** on GitHub.

<br>

🎉 **Enjoy using JazzRadio Bot and happy coding!**
