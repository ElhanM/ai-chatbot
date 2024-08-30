package routes

import (
	"github.com/gin-gonic/gin"
)

func ChatsRoutes(r *gin.RouterGroup) {
	chats := r.Group("/chats")
	{
		ConversationRoutes(chats)
		MessageRoutes(chats)
	}
}
