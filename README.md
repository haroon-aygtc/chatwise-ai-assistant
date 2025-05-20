# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/721a6b33-ca3a-4116-9dd6-0cbc3c56b583

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/721a6b33-ca3a-4116-9dd6-0cbc3c56b583) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/721a6b33-ca3a-4116-9dd6-0cbc3c56b583) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# Chatwise AI Assistant

A powerful AI chat assistant platform with multiple language model integrations.

## Supported AI Providers

The application supports the following AI providers:

- OpenAI (GPT-3.5, GPT-4)
- Anthropic Claude
- Google Gemini
- More providers can be added via the modular provider system

## Project Structure

This project consists of:

- **Frontend**: React application with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: Laravel 12 PHP application providing API endpoints and AI service integration

## Google Gemini Integration

The application includes full support for Google's Gemini AI models with the following features:

- API key validation and configuration
- Customizable model parameters (temperature, maxTokens, topP, topK)
- Testing interface for Gemini responses
- Seamless integration with existing chat workflows

### Gemini Configuration

To use Google Gemini models:

1. Obtain a Google Gemini API key
2. Configure the model in the admin interface under AI Configuration
3. Adjust parameters as needed for your use case

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- PHP 8.1+ and Composer
- MySQL or PostgreSQL database

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd chatwise-ai-assistant

# Install frontend dependencies
npm i

# Install backend dependencies
composer install

# Start the development server
npm run dev
```

## Deployment

For deployment instructions, see the [deployment documentation](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide).

## Technologies Used

This project is built with:

- Frontend:
  - Vite
  - TypeScript
  - React
  - shadcn-ui
  - Tailwind CSS
  
- Backend:
  - Laravel 12
  - PHP 8.1+
