package jwts

import (
	gormDB "github.com/ElhanM/ai-chatbot/db"
	"github.com/ElhanM/ai-chatbot/models"
	"github.com/google/uuid"
)

func SetAccessToken(accessToken string, userId uuid.UUID) {
	var user models.User
	gormDB.DB.Where("id = ?", userId).First(&user)
	user.AccessToken = accessToken
	gormDB.DB.Save(&user)

}

func GetAccessToken(userId uuid.UUID) string {
	var user models.User
	gormDB.DB.Where("id = ?", userId).First(&user)
	return user.AccessToken
}
