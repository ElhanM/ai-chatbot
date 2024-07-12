package main

import (
	"github.com/ElhanM/ai-chatbot/envs"
	"github.com/ElhanM/ai-chatbot/routes"
	"github.com/gin-gonic/gin"
)

func setupRouter() *gin.Engine {
	r := gin.Default()

	// Setup routes using the routes package
	routes.SetupRouter(r)

	return r
}

func main() {
	envs.LoadEnv()
	port := envs.GetPort()

	r := setupRouter()
	r.Run(":" + port)
}
