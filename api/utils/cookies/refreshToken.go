package cookies

import "github.com/gin-gonic/gin"

func SetRefreshToken(c *gin.Context, refreshToken string) {
	// 604800 seconds = 1 week
	c.SetCookie("refresh_token", refreshToken, 604800, "/", "localhost", false, true)
}

func GetRefreshToken(c *gin.Context) string {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		return ""
	}
	return refreshToken
}
