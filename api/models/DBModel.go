package models

import (
	"time"

	"github.com/google/uuid"
)

type DBModel struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primary_key;unique;not null" json:"id"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}
