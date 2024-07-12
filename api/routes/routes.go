package routes

import (
	"net/http"

	routes "github.com/ElhanM/ai-chatbot/routes/auth"
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
		HealthRoute(api)
		SuccessRoute(api)
		ErrorRoute(api)

		// Define the auth subgroup
		auth := api.Group("/auth")
		{
			routes.AuthRoutes(auth)
		}
	}

	// Catch all route
	r.NoRoute(func(c *gin.Context) {
		response := responses.NewErrorResponse("Route not found", http.StatusNotFound)
		c.JSON(http.StatusNotFound, response)
	})
}
