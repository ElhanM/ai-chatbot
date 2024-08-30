Server bootstrapted with:
`go mod init github.com/ElhanM/ai-chatbot`

For first time starting the server, run `go mod tidy` to download all the dependencies, and only then run `go run main.go` to start the server.

If you encounter `[GIN-debug] [ERROR] listen tcp :5019: bind: address already in use`, try running:
`killall air`

To use Live reload - run `air` inside of api directory.

In order to run the tests:
Install godotenv: `go install github.com/joho/godotenv/cmd/godotenv@latest`

Run the tests (use godotenv to load the env variables): `godotenv -f .env.test go test -v ./...`
If you want to see the logs for tests that are not failing, you have to provide go test the -v flag (v for verbosity).
