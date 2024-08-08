package routes

import (
	"github.com/ElhanM/ai-chatbot/controllers"
	"github.com/gin-gonic/gin"
)

func ConversationRoutes(r *gin.RouterGroup) {
	r.GET("/conversations", controllers.GetConversations)
	r.GET("/latest-conversation", controllers.GetLatestConversation)
	r.POST("/conversation", controllers.CreateConversation)
}
