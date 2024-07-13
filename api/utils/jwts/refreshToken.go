package jwts

import (
	gormDB "github.com/ElhanM/ai-chatbot/db"
	"github.com/ElhanM/ai-chatbot/models"
	"github.com/google/uuid"
)

func SetRefreshToken(refreshToken string, userId uuid.UUID) {
	var user models.User
	gormDB.DB.Where("id = ?", userId).First(&user)
	user.RefreshToken = refreshToken
	gormDB.DB.Save(&user)
}

func GetRefreshToken(userId uuid.UUID) string {
	var user models.User
	gormDB.DB.Where("id = ?", userId).First(&user)
	return user.RefreshToken
}
