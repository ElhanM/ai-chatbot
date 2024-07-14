package models

import (
	"time"

	"github.com/google/uuid"
)

type DBModel struct {
	// We omit ID field from JSON response due to security reasons
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primary_key;unique;not null" json:"-"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}
