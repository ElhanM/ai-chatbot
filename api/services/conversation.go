package services

import (
	gormDB "github.com/ElhanM/ai-chatbot/db"
	"github.com/ElhanM/ai-chatbot/models"
	"github.com/google/uuid"
)

func GetConversations(userID uuid.UUID) ([]models.Conversation, error) {
	var conversations []models.Conversation
	if err := gormDB.DB.Where("user_id = ?", userID).Find(&conversations).Error; err != nil {
		return nil, err
	}
	return conversations, nil
}
