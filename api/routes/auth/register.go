package routes

import (
	"fmt"
	"net/http"

	gormDB "github.com/ElhanM/ai-chatbot/db"
	"github.com/ElhanM/ai-chatbot/models"
	"github.com/ElhanM/ai-chatbot/services"
	"github.com/ElhanM/ai-chatbot/utils"
	"github.com/ElhanM/ai-chatbot/utils/responses"
	"github.com/gin-gonic/gin"
)

type RegisterRequest struct {
	Name string `json:"name" binding:"required"`
	LoginRequest
}

func RegisterRoute(r *gin.RouterGroup) {
	r.POST("/register", func(c *gin.Context) {
		var req RegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Invalid request").Error())
			c.JSON(http.StatusBadRequest, errorResponse)
			return
		}

		hashedPassword, err := utils.HashPassword(req.Password)
		if err != nil {
			errorMsg := fmt.Sprintf("Failed to hash password: %v", err)
			c.JSON(http.StatusInternalServerError, errorMsg)
			return
		}

		user := models.User{
			Name:     req.Name,
			Email:    req.Email,
			Password: hashedPassword,
		}

		if err := gormDB.DB.Create(&user).Error; err != nil {
			errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Failed to create user").Error())
			c.JSON(http.StatusInternalServerError, errorResponse)
			return
		}

		_, err = services.CreateConversation(user.ID)
		if err != nil {
			errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Failed to create conversation").Error())
			c.JSON(http.StatusInternalServerError, errorResponse)
			return
		}

		data := map[string]interface{}{"id": user.ID, "name": user.Name, "email": user.Email}
		response := responses.NewServiceResponse(responses.Success, "User registered successfully", data, nil)
		c.JSON(http.StatusOK, response)
	})
}
