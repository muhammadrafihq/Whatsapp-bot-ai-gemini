# WhatsApp Bot with Express and Google Generative AI

This project is a WhatsApp bot that interfaces with WhatsApp Web and Google Generative AI to generate responses to incoming messages. The bot can now detect whether a message contains only text or a combination of text and image, enabling it to generate appropriate responses based on the message content.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)

## Prerequisites

Before you begin, ensure you have the following installed on your system: Node.js (v14.x or later), npm (v6.x or later), Git (optional but recommended)

## Installation

1. **Clone the Repository:** `git clone https://github.com/your-username/whatsapp-bot-ai.git && cd whatsapp-bot-ai`

2. **Install Dependencies:** `npm install`

## Configuration

1. **Set Up Environment Variables:** Create a `.env` file in the root directory and add `API_KEY=your_google_generative_ai_api_key`.

2. **Modify Puppeteer Settings (if running as root):** Add `args: ['--no-sandbox', '--disable-setuid-sandbox']` to the Puppeteer configuration in your code.

## Usage

1. **Start the Application:** Run `npm run dev` if you running in local .

2. **Scan QR Code:** A QR code will be generated in the terminal. Scan it with your WhatsApp mobile app to authenticate.

3. **Interact with the Bot:** Send messages to the WhatsApp number associated with the bot; it will respond using Google Generative AI.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements.

