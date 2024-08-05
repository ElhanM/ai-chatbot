package services

import (
	gormDB "github.com/ElhanM/ai-chatbot/db"
	"github.com/ElhanM/ai-chatbot/models"
	"github.com/google/uuid"
)

func GetConversations(userID uuid.UUID, limit, offset int) ([]models.Conversation, int, error) {
	var conversations []models.Conversation
	var count int64

	query := gormDB.DB.Model(&models.Conversation{}).Where("user_id = ?", userID)
	query.Count(&count)

	if limit > 0 {
		query = query.Limit(limit)
	}
	if offset > 0 {
		query = query.Offset(offset)
	}
	if err := query.Find(&conversations).Error; err != nil {
		return nil, 0, err
	}
	return conversations, int(count), nil
}