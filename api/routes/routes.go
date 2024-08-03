package routes

import (
	"net/http"

	"github.com/ElhanM/ai-chatbot/middleware"
	authRoutes "github.com/ElhanM/ai-chatbot/routes/auth"
	protectedRoutes "github.com/ElhanM/ai-chatbot/routes/protected"
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
		JwtsRoute(api)

		// Define the auth subgroup
		auth := api.Group("/auth")
		{
			authRoutes.AuthRoutes(auth)
		}

		// Define the protected subgroup
		protectedGroup := api.Group("/protected")
		protectedGroup.Use(middleware.GuardMiddleware())
		{
			protectedRoutes.ProtectedRoutes(protectedGroup)
		}
	}

	// Catch all route
	r.NoRoute(func(c *gin.Context) {
		response := responses.NewErrorResponse("Route not found")
		c.JSON(http.StatusNotFound, response)
	})
}
