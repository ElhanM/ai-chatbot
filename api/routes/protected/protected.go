package routes

import (
	"github.com/gin-gonic/gin"
)

func ProtectedRoutes(r *gin.IRoutes) {
	PingRoute(r)
	ClearTokensRoute(r)
}
