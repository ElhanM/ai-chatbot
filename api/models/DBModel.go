package models

import (
	"time"

	"github.com/google/uuid"
)

type BaseDBModel struct {
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}

type DBModelNoID struct {
	ID uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primary_key;unique;not null" json:"-"`
	BaseDBModel
}

type DBModel struct {
	ID uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primary_key;unique;not null" json:"id"`
	BaseDBModel
}
