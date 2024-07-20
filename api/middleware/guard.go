package middleware

import (
	"net/http"

	"github.com/ElhanM/ai-chatbot/models"
	"github.com/ElhanM/ai-chatbot/utils"
	"github.com/ElhanM/ai-chatbot/utils/enums"
	"github.com/ElhanM/ai-chatbot/utils/jwts"
	"github.com/ElhanM/ai-chatbot/utils/responses"
	"github.com/gin-gonic/gin"
)

func GuardMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		userId := c.GetHeader("Authorization")

		// Validate the JWT tokens using CheckJWTs function
		data, err, _ := jwts.CheckJWTs(userId)
		if err != nil {
			errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Unauthorized").Error())
			errorResponse.ErrorCode = enums.GuardFailure // Unique error code to differentiate from other errors on the client side
			c.AbortWithStatusJSON(http.StatusUnauthorized, errorResponse)
			return
		}

		user := data["user"].(models.User)
		c.Set("user", user)

		c.Next()
	}
}
