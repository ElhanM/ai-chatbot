package jwts

import (
	"testing"

	"github.com/ElhanM/ai-chatbot/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestRefreshAccessToken(t *testing.T) {
	userID := uuid.New()
	refreshToken, err := utils.GenerateRefreshToken(userID)
	assert.NoError(t, err)

	c := &gin.Context{}

	newAccessToken, err := RefreshAccessToken(c, refreshToken)
	assert.NoError(t, err)
	assert.NotNil(t, newAccessToken)

	// Parse the new access token to verify the claims
	claims, _, err := utils.ParseToken(*newAccessToken, true)
	assert.NoError(t, err)
	assert.Equal(t, userID.String(), claims["sub"])
}

func TestRefreshAccessToken_InvalidToken(t *testing.T) {
	c := &gin.Context{}
	invalidToken := "invalid.token.string"

	newAccessToken, err := RefreshAccessToken(c, invalidToken)
	assert.Error(t, err)
	assert.Nil(t, newAccessToken)
}
