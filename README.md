
# 🎷 JazzRadio

![Banner](preview/JazzRadio.gif)

![Node.js](https://img.shields.io/badge/Node.js-v20+-green?style=for-the-badge&logo=node.js)
![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue?style=for-the-badge&logo=discord)
![License](https://img.shields.io/badge/License-AGPL_v3-red?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Code Style](https://img.shields.io/badge/Code_Style-Prettier-ff69b4?style=for-the-badge&logo=prettier)
![Genre](https://img.shields.io/badge/Genre-Smooth_Jazz-purple?style=for-the-badge&logo=applemusic)
![Uptime](https://img.shields.io/badge/Uptime-24%2F7-blue?style=for-the-badge)
![Quality](https://img.shields.io/badge/Quality-High_Definition-orange?style=for-the-badge)

**JazzRadio** is a Discord bot dedicated to streaming smooth, high-quality Jazz music 24/7. Built with modern Discord.js and optimized for performance.

## 🌟 Features

- **24/7 Streaming**: Continuous smooth Jazz stream.
- **High Quality Audio**: Uses `sodium-native` for optimal performance.
- **Easy Control**: Interactive **Stop Button** 🛑 and slash commands.
- **Auto Reconnection**: Automatically rejoins if the stream or connection drops.
- **Custom Status**: Rotates through legendary Jazz artists.

## 🛠️ Installation

### Prerequisites

- **Node.js v20.0.0** or higher
- **npm** (Node Package Manager)
- **FFmpeg** (Required for audio processing)

### Linux (Ubuntu/Debian) Requirements
If running on Linux, you must install build tools for the encryption libraries:
```bash
sudo apt-get update
sudo apt-get install -y build-essential python3 libtool automake autoconf ffmpeg
```

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ExceptedPrism3/JazzRadio.git
   cd JazzRadio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file:**
   ```env
   TOKEN=your_bot_token
   ```

4. **Configure the bot (Optional):**
   Edit `config.json` to customize the status messages or radio URL.

5. **Register Commands:**
   ```bash
   node utils/deploy-commands.js
   ```

6. **Run the bot:**
   ```bash
   # For development
   node index.js

   # For production (recommended)
   pm2 start index.js --name jazzradio
   ```

## 🎮 Commands

- **/play** - 🎷 Start playing the Jazz stream in your voice channel.
- **/stop** - 🛑 Stop the radio and leave the channel.
- **/ping** - 🏓 Check the bot's latency.
- **/uptime** - ⏱️ Check how long the bot has been running.
- **/info** - ℹ️ Get information about the bot.
- **/vote** - 🗳️ Get voting and invite links.
- **/help** - ❓ List all available commands.

## 🤝 Contribution

We welcome contributions! Feel free to fork this project, submit issues, or create pull requests.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes.
4. Push to the branch.
5. Create a new Pull Request.

## 📜 License

This project is licensed under the **GNU AGPL v3** License - see the **[LICENSE](LICENSE)** file for details.

## ✉️ Contact

For any questions or feedback, please reach out over the **[Discord Support Server](https://discord.gg/MfR5mcpVfX)** or open an **[Issue](https://github.com/ExceptedPrism3/JazzRadio/issues)** on GitHub.

---

Made with ❤️ by **Prism3**
