package models

import (
	"github.com/google/uuid"
)

type Conversation struct {
	DBModel
	UserID uuid.UUID `gorm:"type:uuid;not null" json:"userId"`
	Title  string    `gorm:"not null" json:"title"`
}
