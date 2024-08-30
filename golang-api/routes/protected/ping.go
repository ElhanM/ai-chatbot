package routes

import (
	"net/http"

	"github.com/ElhanM/ai-chatbot/utils/responses"
	"github.com/gin-gonic/gin"
)

func PingRoute(r *gin.RouterGroup) {
	(*r).GET("/ping", func(c *gin.Context) {
		user, exists := c.Get("user")

		if !exists {
			response := responses.NewErrorResponse("Unauthorized")
			c.JSON(http.StatusUnauthorized, response)
			return
		}

		response := responses.NewServiceResponse(responses.Success, "Pong", user, nil)
		c.JSON(http.StatusOK, response)
	})
}
