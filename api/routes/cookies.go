package routes

import (
	"net/http"

	"github.com/ElhanM/ai-chatbot/envs"
	"github.com/ElhanM/ai-chatbot/utils"
	"github.com/ElhanM/ai-chatbot/utils/cookies"
	"github.com/ElhanM/ai-chatbot/utils/responses"
	"github.com/gin-gonic/gin"
)

// TODO:
// CookiesRoute will be used for auth
// If access token is expired, it will be refreshed using refresh token
// If refresh token is expired, user will be logged out
// Also, apply better code splitting to this function
// and to api/routes/auth/login.go and api/routes/auth/register.go
// and write tests for them
func CookiesRoute(r *gin.RouterGroup) {
	r.GET("/cookies", func(c *gin.Context) {
		environtment := envs.GetEnvirontment()

		accessToken, refreshToken := cookies.GetAccessToken(c), cookies.GetRefreshToken(c)

		decodedAccessToken, err := utils.DecodeToken(accessToken, true)
		if err != nil {
			response := responses.NewErrorResponse("Failed to decode access token")
			c.JSON(http.StatusInternalServerError, response)
			return
		}

		decodedRefreshToken, err := utils.DecodeToken(refreshToken, false)
		if err != nil {
			response := responses.NewErrorResponse("Failed to decode refresh token")
			c.JSON(http.StatusInternalServerError, response)
			return
		}

		isValidAccessToken, accaccessTokenExp, err := utils.CheckTokenExpiration(accessToken, true)
		if err != nil {
			response := responses.NewErrorResponse("Failed to check access token expiration")
			c.JSON(http.StatusInternalServerError, response)
			return
		}

		isValidRefreshToken, refreshTokenExp, err := utils.CheckTokenExpiration(refreshToken, false)
		if err != nil {
			response := responses.NewErrorResponse("Failed to check refresh token expiration")
			c.JSON(http.StatusInternalServerError, response)
			return
		}

		var data map[string]interface{}
		if environtment == "development" {
			data = map[string]interface{}{"accessToken": accessToken, "refreshToken": refreshToken, "decodedAccessToken": decodedAccessToken, "decodedRefreshToken": decodedRefreshToken, "isValidAccessToken": isValidAccessToken, "isValidRefreshToken": isValidRefreshToken, "accessTokenExp": accaccessTokenExp, "refreshTokenExp": refreshTokenExp}
		} else {
			data = map[string]interface{}{"isValidAccessToken": isValidAccessToken, "isValidRefreshToken": isValidRefreshToken}
		}

		response := responses.NewServiceResponse(responses.Success, "Cookie check", data, nil)

		c.JSON(http.StatusOK, response)
	})
}
