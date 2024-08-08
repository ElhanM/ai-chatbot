package routes

import (
	"net/http"

	"github.com/ElhanM/ai-chatbot/utils"
	"github.com/ElhanM/ai-chatbot/utils/jwts"
	"github.com/ElhanM/ai-chatbot/utils/responses"
	"github.com/gin-gonic/gin"
)

func JwtsRoute(r *gin.RouterGroup) {
	r.GET("/jwts/:userId", func(c *gin.Context) {
		userIdStr := c.Param("userId")

		data, errorCode, err := jwts.CheckJWTs(userIdStr)
		if err != nil {
			errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Unauthorized").Error())
			if errorCode != nil {
				errorResponse.ErrorCode = *errorCode
			}
			c.AbortWithStatusJSON(http.StatusUnauthorized, errorResponse)
			return
		}

		response := responses.NewServiceResponse(responses.Success, "JWT check", data, nil)
		c.JSON(http.StatusOK, response)
	})
}
