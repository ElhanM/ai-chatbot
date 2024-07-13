package jwts

import (
	"errors"

	"github.com/ElhanM/ai-chatbot/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// RefreshAccessToken generates a new access token using the provided refresh token.
func RefreshAccessToken(c *gin.Context, refreshToken string) (string, error) {
	// Decode the refresh token
	decodedRefreshToken, err := utils.DecodeToken(refreshToken, false)
	if err != nil {
		return "", errors.New("invalid refresh token")
	}

	// Check if the refresh token is valid and not expired
	isValidRefreshToken, _, err := utils.CheckTokenExpiration(refreshToken, false)
	if err != nil || !isValidRefreshToken {
		return "", errors.New("expired or invalid refresh token")
	}

	// Get the user ID from the refresh token claims
	userIdStr, ok := decodedRefreshToken["sub"].(string)
	if !ok {
		return "", errors.New("invalid refresh token claims")
	}

	userId, err := uuid.Parse(userIdStr)
	if err != nil {
		return "", errors.New("invalid user ID in refresh token")
	}

	// Generate a new access token
	newAccessToken, err := utils.GenerateAccessToken(userId)
	if err != nil {
		return "", errors.New("failed to generate new access token")
	}

	// Return the new access token
	return newAccessToken, nil
}
