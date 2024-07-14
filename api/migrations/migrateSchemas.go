package migrations

import (
	gormDB "github.com/ElhanM/ai-chatbot/db"
	"github.com/ElhanM/ai-chatbot/models"
)

func MigrateSchema() error {
	// Migrate the schemas
	return gormDB.DB.AutoMigrate(&models.User{})
}
