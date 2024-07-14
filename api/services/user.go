package services

import (
	gormDB "github.com/ElhanM/ai-chatbot/db"
	"github.com/ElhanM/ai-chatbot/models"
	"github.com/google/uuid"
)

func FetchUserById(id uuid.UUID) (*models.User, error) {
	var user models.User
	result := gormDB.DB.Where("id = ?", id).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}
