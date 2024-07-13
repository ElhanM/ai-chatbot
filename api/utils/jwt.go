// utils/jwt.go
package utils

import (
	"fmt"
	"time"

	"github.com/ElhanM/ai-chatbot/envs"
	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
)

var (
	accessSecret  = []byte(envs.GetAccessTokenSecret())
	refreshSecret = []byte(envs.GetRefreshTokenSecret())
)

func GenerateAccessToken(userID uuid.UUID) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		// last for 1 hour
		"exp": time.Now().Add(time.Hour * 1).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(accessSecret)
}

func GenerateRefreshToken(userID uuid.UUID) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		// last for 1 week
		"exp": time.Now().Add(time.Hour * 24 * 7).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(refreshSecret)
}

func ValidateToken(tokenString string, isAccessToken bool) (*jwt.Token, error) {
	var secret []byte
	if isAccessToken {
		secret = accessSecret
	} else {
		secret = refreshSecret
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return secret, nil
	})
	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, err
	}

	return token, nil
}

func DecodeToken(tokenString string, isAccessToken bool) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		var secret []byte
		if isAccessToken {
			secret = accessSecret
		} else {
			secret = refreshSecret
		}

		return secret, nil
	})
	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, err
	}

	return token.Claims.(jwt.MapClaims), nil
}

func CheckTokenExpiration(tokenString string, isAccessToken bool) (bool, string, error) {
	token, err := ValidateToken(tokenString, isAccessToken)
	if err != nil {
		return false, "0.00", err
	}

	// Correctly handle the exp claim as a float64 and convert to int64
	exp, ok := token.Claims.(jwt.MapClaims)["exp"].(float64)
	if !ok {
		return false, "0.00", fmt.Errorf("invalid exp claim type")
	}
	expirationTime := time.Unix(int64(exp), 0)
	timeLeft := time.Until(expirationTime)

	timeLeftInHours := fmt.Sprintf("%.2f", timeLeft.Hours())

	return timeLeft > 0, timeLeftInHours, nil
}
