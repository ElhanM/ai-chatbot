package routes

import (
	"net/http"

	"github.com/ElhanM/ai-chatbot/utils/responses"
	"github.com/gin-gonic/gin"
)

func SuccessRoute(r *gin.RouterGroup) {
	// Success route
	r.GET("/success", func(c *gin.Context) {
		data := map[string]interface{}{"id": 1, "name": "Example"}
		count := 1
		response := responses.NewServiceResponse(responses.Success, "Request was successful", data, http.StatusOK, &count)
		c.JSON(http.StatusOK, response)
	})
}
