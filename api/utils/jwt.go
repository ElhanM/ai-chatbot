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
		"sub": userID.String(),
		// last for 1 hour
		"exp": time.Now().Add(time.Hour * 1).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(accessSecret)
}

func GenerateRefreshToken(userID uuid.UUID) (string, error) {
	claims := jwt.MapClaims{
		"sub": userID.String(),
		// last for 1 week
		"exp": time.Now().Add(time.Hour * 24 * 7).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(refreshSecret)
}

func ParseToken(tokenString string, isAccessToken bool) (jwt.MapClaims, bool, error) {
	var secret []byte
	if isAccessToken {
		secret = accessSecret
	} else {
		secret = refreshSecret
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return secret, nil
	})

	// Check if the token is expired
	if err != nil {
		if ve, ok := err.(*jwt.ValidationError); ok {
			if ve.Errors&jwt.ValidationErrorExpired != 0 {
				return token.Claims.(jwt.MapClaims), false, nil
			} else {
				return nil, false, err
			}
		} else {
			return nil, false, err
		}
	}

	return token.Claims.(jwt.MapClaims), true, nil
}

func CheckTokenExpiration(tokenString string, isAccessToken bool) (bool, string, error) {
	claims, isTokenValid, err := ParseToken(tokenString, isAccessToken)
	if err != nil {
		return false, "0.00", err
	}

	exp, ok := claims["exp"].(float64)
	if !ok {
		return false, "0.00", fmt.Errorf("invalid exp claim type")
	}
	expirationTime := time.Unix(int64(exp), 0)
	timeLeft := time.Until(expirationTime)

	timeLeftInHours := fmt.Sprintf("%.2f", timeLeft.Hours())

	return isTokenValid && timeLeft > 0, timeLeftInHours, nil
}
