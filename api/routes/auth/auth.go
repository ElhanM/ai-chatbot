package routes

import (
	"github.com/gin-gonic/gin"
)

func AuthRoutes(r *gin.RouterGroup) {
	LoginRoute(r)
	RegisterRoute(r)
}
