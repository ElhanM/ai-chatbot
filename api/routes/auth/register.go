package routes

import (
	"fmt"
	"net/http"

	gormDB "github.com/ElhanM/ai-chatbot/db"
	"github.com/ElhanM/ai-chatbot/models"
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
			response := responses.NewErrorResponse("Invalid request")
			c.JSON(http.StatusBadRequest, response)
			return
		}

		hashedPassword, err := utils.HashPassword(req.Password)
		if err != nil {
			response := responses.NewErrorResponse("Failed to hash password")
			c.JSON(http.StatusInternalServerError, response)
			return
		}

		user := models.User{
			Name:     req.Name,
			Email:    req.Email,
			Password: hashedPassword,
		}

		if err := gormDB.DB.Create(&user).Error; err != nil {
			errorMsg := fmt.Sprintf("Failed to create user: %v", err)
			response := responses.NewErrorResponse(errorMsg)
			c.JSON(http.StatusInternalServerError, response)
			return
		}

		data := map[string]interface{}{"id": user.ID, "name": user.Name}
		response := responses.NewServiceResponse(responses.Success, "User registered successfully", data, nil)
		c.JSON(http.StatusOK, response)
	})
}
