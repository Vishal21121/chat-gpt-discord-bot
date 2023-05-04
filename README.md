# chat-gpt-discord-bot
Chat-GPT is a Discord bot based on the GPT-3.5 architecture that can chat with users in natural language. This bot uses Node.js and is designed to work on any Discord server.

## Installation

To use Chat-GPT, you need to have Node.js installed on your computer. Then, follow these steps:
1. Clone the repository from GitHub.
2. Install the required packages using `npm install`.
3. Create a new Discord bot and get its token.
4. Add the bot to your Discord server.
5. Copy the .env.example file to .env and fill in the required values, including your Discord bot token.
6. Then register the commands of the bot in your server using
`node deploy-commands.js`

7. Then enter `npm start` command to spin up the bot

## Docker Image
A Dockerfile is provided in the repository, allowing you to build your own Docker image of Chat-GPT. To build an image, run the following command:

```
docker build -t chat-gpt .
```
Alternatively, a pre-built image is available on Docker Hub. You can pull the image using the following command:

```
docker pull vishal21121/chat-gpt-discord-bot:0.0.1.RELEASE
```

## Usage

Once you have installed Chat-GPT, you can start using it on your Discord server. The bot has the following five commands:

1. `/chat-gpt`: Takes prompt from user and gives user a response using chat-gpt api.

2. `/generate-image`: Generates images based on the given prompt
3. `/good-first-issue `: Shows good first issue
4. `/my-commits`: Takes github user id and shows commits for that day.
5. `/server`: Gives basic information about the server

To use any of these commands, simply type them in a text channel where the bot is present.

## License
This project is licensed under the [MIT License](LICENSE). See the LICENSE file for more information.

## Support 🙏

Hey, if you find my GitHub repository **chat-gpt-discord-bot** helpful, could you consider leaving a star ⭐ for it? It would mean a lot to me and help others discover the project. Thanks in advance!
