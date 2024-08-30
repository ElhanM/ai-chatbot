package jwts

import (
	"github.com/ElhanM/ai-chatbot/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func RefreshAccessToken(c *gin.Context, refreshToken string) (*string, error) {
	// Decode the refresh token
	decodedRefreshToken, _, err := utils.ParseToken(refreshToken, false)
	if err != nil {
		return nil, utils.BuildError(err, "failed to decode refresh token")
	}

	// Check if the refresh token is valid and not expired
	isValidRefreshToken, _, err := utils.CheckTokenExpiration(refreshToken, false)
	if err != nil || !isValidRefreshToken {
		return nil, utils.BuildError(err, "expired or invalid refresh token")
	}

	// Get the user ID from the refresh token claims
	userIdStr, ok := decodedRefreshToken["sub"].(string)
	if !ok {
		// Fallback to the "user_id" claim if "sub" is not present
		userIdStr, ok = decodedRefreshToken["user_id"].(string)
		if !ok {
			return nil, utils.BuildError(err, "invalid refresh token claims")
		}
	}

	userId, err := uuid.Parse(userIdStr)
	if err != nil {
		return nil, utils.BuildError(err, "invalid user ID in refresh token")
	}

	// Generate a new access token
	newAccessToken, err := utils.GenerateAccessToken(userId)
	if err != nil {
		return nil, utils.BuildError(err, "failed to generate new access token")
	}

	// Return the new access token
	return &newAccessToken, nil
}
