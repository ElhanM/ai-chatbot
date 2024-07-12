package routes

import (
	"net/http"

	"github.com/ElhanM/ai-chatbot/utils/responses"
	"github.com/gin-gonic/gin"
)

func HealthRoute(r *gin.RouterGroup) {
	// Health check
	r.GET("/health", func(c *gin.Context) {
		response := responses.NewServiceResponse(responses.Success, "Server is healthy", struct{}{}, nil)
		c.JSON(http.StatusOK, response)
	})
}
