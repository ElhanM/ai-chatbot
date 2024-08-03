package models

import (
	"github.com/google/uuid"
)

type Message struct {
	DBModel
	ConversationID uuid.UUID `gorm:"type:uuid;not null" json:"conversationId"`
	Sender         string    `gorm:"not null" json:"sender"` // "user" or "bot"
	Content        string    `gorm:"not null" json:"content"`
}
