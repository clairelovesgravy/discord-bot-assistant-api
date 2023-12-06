# discord-bot-assistant-api

This project is a Discord bot that integrates with OpenAI's GPT-based assistant to respond to user messages and provide helpful information, responses, or engage in conversations using the OpenAI API.

## Features

- Respond to direct messages (DMs) on Discord with AI-powered responses.
- Operate in specific authorized channels within guilds.
- Manage conversations using OpenAI's thread management for continuity.
- Ability to process and respond to attachments by uploading them to OpenAI.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed [Node.js](https://nodejs.org/en/download/) which includes `npm`.
- You have a Discord account and have created a bot on the Discord developer portal.
- You have obtained your OpenAI API key by creating an account on [OpenAI](https://openai.com/).

## Setup

To set up the OpenAI Discord Bot, follow these steps:

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/clairelovesgravy/discord-bot-assistant-api
    cd discord-bot-assistant-api
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Rename `.env.example` to `.env` and fill in your credentials:

    ```plaintext
    DISCORD_TOKEN=your_discord_bot_token
    CLIENT_ID=your_discord_client_id
    OPENAI_API_KEY=your_openai_api_key
    ASSISTANT_ID=your_openai_assistant_id
    AUTHORIZEDCHANNELID=your_authorized_channel_id(s)
    AUTHORIZEDUSERID=your_authorized_user_id(s)
    ```

## Deployment

To deploy the bot, you can run it locally on your machine or use a cloud provider. To run it locally:

    ```bash
    node index.js
    ```

Your bot should now be online and functional! To deploy it to a cloud platform, follow the provider's instructions for deploying Node.js applications.

## Usage

Once the bot is deployed and running, it will listen for messages in the authorized channels and direct messages. If it's mentioned in a message or receives a DM, it will use the OpenAI API to generate a response.

- To interact with the bot, simply mention it in one of the authorized channels or send it a direct message.
- You can also send attachments, and the bot will process and respond to them as configured.

## Contributing to OpenAI Discord Bot

To contribute to the OpenAI Discord Bot, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

Alternatively, see the GitHub documentation on [creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

## Contact

If you want to contact me, you can reach me at `claireqkl@gmail.com`.

## License

This project uses the following license: [MIT License](<link_to_license>).
