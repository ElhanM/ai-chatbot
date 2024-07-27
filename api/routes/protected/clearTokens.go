package routes

import (
	"net/http"

	"github.com/ElhanM/ai-chatbot/models"
	"github.com/ElhanM/ai-chatbot/services"
	"github.com/ElhanM/ai-chatbot/utils/responses"
	"github.com/gin-gonic/gin"
)

func ClearTokensRoute(r *gin.IRoutes) {
	(*r).DELETE("/clear-tokens", func(c *gin.Context) {
		user, exists := c.Get("user")

		if !exists {
			response := responses.NewErrorResponse("Unauthorized")
			c.JSON(http.StatusUnauthorized, response)
			return
		}

		switch u := user.(type) {
		case models.User:
			err := services.ClearUserTokens(u.ID)
			if err != nil {
				response := responses.NewErrorResponse(err.Error())
				c.JSON(http.StatusInternalServerError, response)
				return
			}

			response := responses.NewServiceResponse(responses.Success, "Tokens cleared", struct{}{}, nil)
			c.JSON(http.StatusOK, response)
		default:
			response := responses.NewErrorResponse("Unauthorized")
			c.JSON(http.StatusUnauthorized, response)
		}
	})
}
