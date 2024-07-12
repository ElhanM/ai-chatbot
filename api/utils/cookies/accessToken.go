package cookies

import (
	"github.com/gin-gonic/gin"
)

func SetAccessToken(c *gin.Context, accessToken string) {
	// 3600 seconds = 1 hour
	c.SetCookie("access_token", accessToken, 3600, "/", "localhost", false, true)
}

func GetAccessToken(c *gin.Context) string {
	accessToken, err := c.Cookie("access_token")
	if err != nil {
		return ""
	}
	return accessToken
}
