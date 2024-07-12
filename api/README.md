Server bootstrapted with:
`go mod init github.com/ElhanM/ai-chatbot`

For first time starting the server, run `go mod tidy` to download all the dependencies, and only then run `go run main.go` to start the server.

If you encounter `[GIN-debug] [ERROR] listen tcp :5019: bind: address already in use`, run:
`sudo lsof -t -i:5019 | xargs kill`

To use Live reload - run `air` inside of api directory.
