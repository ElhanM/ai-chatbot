package routes

import (
	"net/http"

	gormDB "github.com/ElhanM/ai-chatbot/db"
	"github.com/ElhanM/ai-chatbot/models"
	"github.com/ElhanM/ai-chatbot/utils"
	"github.com/ElhanM/ai-chatbot/utils/jwts"
	"github.com/ElhanM/ai-chatbot/utils/responses"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func LoginRoute(r *gin.RouterGroup) {
	r.POST("/login", func(c *gin.Context) {
		var req LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			response := responses.NewErrorResponse("Invalid request")
			c.JSON(http.StatusBadRequest, response)
			return
		}

		var user models.User
		if err := gormDB.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
			response := responses.NewErrorResponse("User not found")
			c.JSON(http.StatusUnauthorized, response)
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
			response := responses.NewErrorResponse("Invalid credentials")
			c.JSON(http.StatusUnauthorized, response)
			return
		}

		accessToken, err := utils.GenerateAccessToken(user.ID)
		if err != nil {
			response := responses.NewErrorResponse("Failed to generate access token")
			c.JSON(http.StatusInternalServerError, response)
			return
		}

		refreshToken, err := utils.GenerateRefreshToken(user.ID)
		if err != nil {
			response := responses.NewErrorResponse("Failed to generate refresh token")
			c.JSON(http.StatusInternalServerError, response)
			return
		}

		jwts.SetAccessToken(accessToken, user.ID)
		jwts.SetRefreshToken(refreshToken, user.ID)

		data := map[string]interface{}{"id": user.ID, "name": user.Name}
		response := responses.NewServiceResponse(responses.Success, "Login successful", data, nil)
		c.JSON(http.StatusOK, response)
	})
}
