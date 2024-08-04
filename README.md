# AI Chatbot

An AI Chatbot app built with React Native, TypeScript, Tailwind, and Zustand on the frontend, and Golang, Gin, and Gorm on the backend. The app leverages the OpenAI API to generate streamed responses to user input.

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ElhanM/ai-chatbot.git
   cd ai-chatbot
   ```

2. Navigate to the `./app` directory and install React Native dependencies:

   ```bash
   cd app
   nvm use
   npm install
   ```

3. Navigate to the `./api` directory and install Go dependencies:
   ```bash
   cd api
   go mod tidy
   ```

### Running the Project

Run the entire project with a single command from the root directory (make sure Docker is running on your machine):

```bash
make ai-chatbot
```

This command will:

- Start the React Native frontend, viewable on your device or emulator using the Expo Go app.
- Start the Golang backend server, accessible at http://localhost:5019.
- Launch the Postgres database inside a Docker container.

## Quality Assurance

- I used Test-Driven Development (TDD) while building this project.
- The tests run automatically when you push your code to the repository via GitHub Actions.
