package routes

import (
	"net/http"

	"github.com/ElhanM/ai-chatbot/utils/responses"
	"github.com/gin-gonic/gin"
)

func ErrorRoute(r *gin.RouterGroup) {
	// Error route
	r.GET("/error", func(c *gin.Context) {
		response := responses.NewErrorResponse("Internal server error", http.StatusInternalServerError)
		c.JSON(http.StatusInternalServerError, response)
	})
}
