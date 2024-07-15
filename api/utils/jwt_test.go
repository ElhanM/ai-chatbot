package utils

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

// TODO: Write better tests

func TestGenerateAccessToken(t *testing.T) {
	userID := uuid.New()

	tokenString, err := GenerateAccessToken(userID)
	assert.NoError(t, err)
	assert.NotEmpty(t, tokenString)

	// Parse the token to verify the claims
	claims, _, err := ParseToken(tokenString, true)
	assert.NoError(t, err)
	assert.Equal(t, userID.String(), claims["sub"])
}

func TestGenerateRefreshToken(t *testing.T) {
	userID := uuid.New()

	tokenString, err := GenerateRefreshToken(userID)
	assert.NoError(t, err)
	assert.NotEmpty(t, tokenString)

	// Parse the token to verify the claims
	claims, _, err := ParseToken(tokenString, false)
	assert.NoError(t, err)
	assert.Equal(t, userID.String(), claims["sub"])
}

func TestParseToken(t *testing.T) {
	userID := uuid.New()

	accessToken, _ := GenerateAccessToken(userID)
	refreshToken, _ := GenerateRefreshToken(userID)

	dummyUUID := "8e3d56ca-a0d5-4048-8498-3602b606774d"
	expiredToken := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjEwNTc4MTUsInN1YiI6IjhlM2Q1NmNhLWEwZDUtNDA0OC04NDk4LTM2MDJiNjA2Nzc0ZCJ9.q3WtxCfgSCpmEaMYlTjGXzUmJFoLlPQ60FN6BQm7JhQ"

	tests := []struct {
		tokenString   string
		isAccessToken bool
		expectedSub   string
		expectValid   bool
		expectError   bool
	}{
		{accessToken, true, userID.String(), true, false},
		{refreshToken, false, userID.String(), true, false},
		{"invalid.token.string", true, "", false, true},
		{expiredToken, true, dummyUUID, false, false},
	}

	for _, test := range tests {
		claims, isValid, err := ParseToken(test.tokenString, test.isAccessToken)

		if test.expectValid {
			assert.NoError(t, err)
			assert.True(t, isValid)
			assert.Equal(t, test.expectedSub, claims["sub"])
		} else {
			if test.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
			assert.False(t, isValid)
		}
	}
}

func TestCheckTokenExpiration(t *testing.T) {
	userID := uuid.New()
	accessToken, _ := GenerateAccessToken(userID)
	refreshToken, _ := GenerateRefreshToken(userID)

	tests := []struct {
		tokenString   string
		isAccessToken bool
		expectValid   bool
	}{
		{accessToken, true, true},
		{refreshToken, false, true},
		{"invalid.token.string", true, false},
	}

	for _, test := range tests {
		isValid, _, err := CheckTokenExpiration(test.tokenString, test.isAccessToken)
		if test.expectValid {
			assert.NoError(t, err)
			assert.True(t, isValid)
		} else {
			assert.Error(t, err)
			assert.False(t, isValid)
		}
	}
}
