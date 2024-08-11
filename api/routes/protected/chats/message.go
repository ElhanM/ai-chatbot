package routes

import (
	"github.com/ElhanM/ai-chatbot/controllers"
	"github.com/gin-gonic/gin"
)

func MessageRoutes(r *gin.RouterGroup) {
	r.GET("/messages/:conversationId", controllers.GetMessages)
	r.POST("/message/:conversationId", controllers.AddMessage)
	r.POST("/message/stream/:conversationId", controllers.StreamBotResponse)
	r.POST("/message/save/:conversationId", controllers.SaveBotResponse)
}
