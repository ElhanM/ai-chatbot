package routes

import (
	"net/http"

	gormDB "github.com/ElhanM/ai-chatbot/db"
	"github.com/ElhanM/ai-chatbot/models"
	"github.com/ElhanM/ai-chatbot/utils"
	"github.com/ElhanM/ai-chatbot/utils/cookies"
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
			response := responses.NewServiceResponse(responses.Failed, "Invalid request", struct{}{}, nil)
			c.JSON(http.StatusBadRequest, response)
			return
		}

		var user models.User
		if err := gormDB.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
			response := responses.NewServiceResponse(responses.Failed, "User not found", struct{}{}, nil)
			c.JSON(http.StatusUnauthorized, response)
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
			response := responses.NewServiceResponse(responses.Failed, "Invalid credentials", struct{}{}, nil)
			c.JSON(http.StatusUnauthorized, response)
			return
		}

		accessToken, err := utils.GenerateAccessToken(user.ID)
		if err != nil {
			response := responses.NewServiceResponse(responses.Failed, "Failed to generate access token", struct{}{}, nil)
			c.JSON(http.StatusInternalServerError, response)
			return
		}

		refreshToken, err := utils.GenerateRefreshToken(user.ID)
		if err != nil {
			response := responses.NewServiceResponse(responses.Failed, "Failed to generate refresh token", struct{}{}, nil)
			c.JSON(http.StatusInternalServerError, response)
			return
		}

		cookies.SetAccessToken(c, accessToken)
		cookies.SetRefreshToken(c, refreshToken)

		data := map[string]interface{}{"id": user.ID, "name": user.Name}
		response := responses.NewServiceResponse(responses.Success, "Login successful", data, nil)
		c.JSON(http.StatusOK, response)
	})
}
