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
			errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Invalid request").Error())
			c.JSON(http.StatusBadRequest, errorResponse)
			return
		}

		var user models.User
		if err := gormDB.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
			errorResponse := responses.NewErrorResponse(utils.BuildError(err, "User not found").Error())
			c.JSON(http.StatusUnauthorized, errorResponse)
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
			errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Invalid credentials").Error())
			c.JSON(http.StatusUnauthorized, errorResponse)
			return
		}

		accessToken, err := utils.GenerateAccessToken(user.ID)
		if err != nil {
			errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Failed to generate access token").Error())
			c.JSON(http.StatusInternalServerError, errorResponse)
			return
		}

		refreshToken, err := utils.GenerateRefreshToken(user.ID)
		if err != nil {
			errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Failed to generate refresh token").Error())
			c.JSON(http.StatusInternalServerError, errorResponse)
			return
		}

		jwts.SetAccessToken(accessToken, user.ID)
		jwts.SetRefreshToken(refreshToken, user.ID)

		data := map[string]interface{}{"id": user.ID, "name": user.Name}
		response := responses.NewServiceResponse(responses.Success, "Login successful", data, nil)
		c.JSON(http.StatusOK, response)
	})
}
