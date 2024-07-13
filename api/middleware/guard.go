package middleware

import (
	"fmt"
	"net/http"

	"github.com/ElhanM/ai-chatbot/models"
	"github.com/ElhanM/ai-chatbot/utils/jwts"
	"github.com/ElhanM/ai-chatbot/utils/responses"
	"github.com/gin-gonic/gin"
)

func GuardMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		userId := c.GetHeader("Authorization")

		fmt.Println("userId: ", userId)

		// Validate the JWT tokens using CheckJWTs function
		data, err := jwts.CheckJWTs(userId)
		if err != nil {
			errMsg := fmt.Sprintf("Unauthorized: %s", err.Error())
			c.AbortWithStatusJSON(http.StatusUnauthorized, responses.NewErrorResponse(errMsg))
			return
		}

		user := data["user"].(models.User)
		c.Set("user", user)

		c.Next()
	}
}
