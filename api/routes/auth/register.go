package routes

import (
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
			response := responses.NewServiceResponse(responses.Failed, "Invalid request", struct{}{}, nil)
			c.JSON(http.StatusBadRequest, response)
			return
		}

		hashedPassword, err := utils.HashPassword(req.Password)
		if err != nil {
			response := responses.NewServiceResponse(responses.Failed, "Failed to hash password", struct{}{}, nil)
			c.JSON(http.StatusInternalServerError, response)
			return
		}

		user := models.User{
			Name:     req.Name,
			Email:    req.Email,
			Password: hashedPassword,
		}

		if err := gormDB.DB.Create(&user).Error; err != nil {
			response := responses.NewServiceResponse(responses.Failed, "Failed to create user", struct{}{}, nil)
			c.JSON(http.StatusInternalServerError, response)
			return
		}

		data := map[string]interface{}{"id": user.ID, "name": user.Name}
		response := responses.NewServiceResponse(responses.Success, "User registered successfully", data, nil)
		c.JSON(http.StatusOK, response)
	})
}
