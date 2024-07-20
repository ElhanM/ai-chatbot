package routes

import (
	"net/http"

	"github.com/ElhanM/ai-chatbot/utils"
	"github.com/ElhanM/ai-chatbot/utils/jwts"
	"github.com/ElhanM/ai-chatbot/utils/responses"
	"github.com/gin-gonic/gin"
)

// JwtsRoute handles the /jwts/:userId endpoint.
func JwtsRoute(r *gin.RouterGroup) {
	r.GET("/jwts/:userId", func(c *gin.Context) {
		userIdStr := c.Param("userId")

		data, err, errorCode := jwts.CheckJWTs(userIdStr)
		if err != nil {
			errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Unauthorized").Error())
			errorResponse.ErrorCode = *errorCode
			c.AbortWithStatusJSON(http.StatusUnauthorized, errorResponse)
			return
		}

		response := responses.NewServiceResponse(responses.Success, "JWT check", data, nil)
		c.JSON(http.StatusOK, response)
	})
}
