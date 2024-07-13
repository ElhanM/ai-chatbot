package routes

import (
	"net/http"

	"github.com/ElhanM/ai-chatbot/utils/jwts"
	"github.com/ElhanM/ai-chatbot/utils/responses"
	"github.com/gin-gonic/gin"
)

// JwtsRoute handles the /jwts/:userId endpoint.
func JwtsRoute(r *gin.RouterGroup) {
	r.GET("/jwts/:userId", func(c *gin.Context) {
		userIdStr := c.Param("userId")

		data, err := jwts.CheckJWTs(userIdStr)
		if err != nil {
			c.JSON(http.StatusInternalServerError, responses.NewErrorResponse(err.Error()))
			return
		}

		response := responses.NewServiceResponse(responses.Success, "JWT check", data, nil)
		c.JSON(http.StatusOK, response)
	})
}
