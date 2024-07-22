# AI Chatbot

AI Chatbot app built with React Native, TypeScript, Tailwind and Zustand on the frontned, and Golang, Gin and Gorm on the backend.
The app utilizes the OpenAI API to generate responses to user input.

Run project with: `make ai-chatbot` from root directory.

This will run the React Native app, which you can view on your device or emulator using the Expo Go app.
It will also run the Golang backend server, which you can, by default, view at [http://localhost:5019](http://localhost:5019).
As well as run the Postgres database inside of a Docker container.

The project uses TDD, which run automatically when pushing your code to the repository due to GitHub Actions.

For first time running the project, run `go mod tidy` inside of `./api` directory first, to download all the dependencies
