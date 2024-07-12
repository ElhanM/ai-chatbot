package routes

import (
	"net/http"

	"github.com/ElhanM/ai-chatbot/utils/responses"
	"github.com/gin-gonic/gin"
)

// SetupRouter sets up the Gin router with application routes
func SetupRouter(r *gin.Engine) {
	r.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/api/v1/health")
	})

	api := r.Group("/api/v1")
	{
		// Health check
		api.GET("/health", func(c *gin.Context) {
			response := responses.NewServiceResponse(responses.Success, "Server is healthy", struct{}{}, http.StatusOK, nil)
			c.JSON(http.StatusOK, response)
		})

		// Success route
		api.GET("/success", func(c *gin.Context) {
			data := map[string]interface{}{"id": 1, "name": "Example"}
			count := 1
			response := responses.NewServiceResponse(responses.Success, "Request was successful", data, http.StatusOK, &count)
			c.JSON(http.StatusOK, response)
		})

		// Error route
		api.GET("/error", func(c *gin.Context) {
			response := responses.NewErrorResponse("Internal server error", http.StatusInternalServerError)
			c.JSON(http.StatusInternalServerError, response)
		})
	}
}
