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

func ClearUserTokens(id uuid.UUID) error {
	result := gormDB.DB.Model(&models.User{}).Where("id = ?", id).Updates(map[string]interface{}{"access_token": "", "refresh_token": ""})
	if result.Error != nil {
		return result.Error
	}
	return nil
}
