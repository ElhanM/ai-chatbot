package routes

import (
	"net/http"

	"github.com/ElhanM/ai-chatbot/utils/responses"
	"github.com/gin-gonic/gin"
)

func LoginRoute(r *gin.RouterGroup) {
	r.POST("/login", func(c *gin.Context) {
		data := map[string]interface{}{"id": 1, "name": "Example"}
		count := 1
		response := responses.NewServiceResponse(responses.Success, "Login successful", data, http.StatusOK, &count)
		c.JSON(http.StatusOK, response)
	})
}
