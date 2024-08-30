package jwts

import (
	"errors"

	gormDB "github.com/ElhanM/ai-chatbot/db"
	"github.com/ElhanM/ai-chatbot/models"
	"github.com/google/uuid"
)

func SetAccessToken(accessToken string, userId uuid.UUID) error {
	var user models.User
	result := gormDB.DB.Where("id = ?", userId).First(&user)
	if result.Error != nil {
		return result.Error // Return the error if any occurs during user retrieval
	}
	if result.RowsAffected == 0 {
		return errors.New("user not found") // Return an error if no user is found
	}
	user.AccessToken = accessToken
	saveResult := gormDB.DB.Save(&user)
	if saveResult.Error != nil {
		return saveResult.Error // Return the error if any occurs during user update
	}
	return nil // Return nil if the access token is successfully updated
}

func GetAccessToken(userId uuid.UUID) (string, error) {
	var user models.User
	result := gormDB.DB.Where("id = ?", userId).First(&user)
	if result.Error != nil {
		return "", result.Error // Return an empty string and the error
	}
	if result.RowsAffected == 0 {
		return "", errors.New("user not found") // Return an error if no rows are affected
	}
	return user.AccessToken, nil // Return the access token and nil error if user is found
}
