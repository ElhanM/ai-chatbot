package routes

import (
	chats "github.com/ElhanM/ai-chatbot/routes/protected/chats"
	"github.com/gin-gonic/gin"
)

func ProtectedRoutes(r *gin.RouterGroup) {
	PingRoute(r)
	ClearTokensRoute(r)
	chats.ChatsRoutes(r)
}
