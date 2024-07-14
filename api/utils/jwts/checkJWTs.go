package jwts

import (
	"github.com/ElhanM/ai-chatbot/envs"
	"github.com/ElhanM/ai-chatbot/services"
	"github.com/ElhanM/ai-chatbot/utils"
	"github.com/google/uuid"
)

// TODO:
// refactor code
// apply better code splitting to this function
// and to api/routes/auth/login.go and api/routes/auth/register.go
// and write tests for them

// CheckJWTs checks the validity of JWTs and returns relevant data and an error if any.
func CheckJWTs(userIdStr string) (map[string]interface{}, error) {
	environment := envs.GetEnvironment()

	userId, err := uuid.Parse(userIdStr)
	if err != nil {
		return nil, utils.BuildError(err, "invalid user ID format")
	}

	accessToken, refreshToken := GetAccessToken(userId), GetRefreshToken(userId)

	decodedAccessToken, _, err := utils.ParseToken(accessToken, true)
	if err != nil {
		return nil, utils.BuildError(err, "failed to decode access token")
	}

	decodedRefreshToken, _, err := utils.ParseToken(refreshToken, false)
	if err != nil {
		return nil, utils.BuildError(err, "failed to decode refresh token")
	}

	isValidAccessToken, accessTokenExp, err := utils.CheckTokenExpiration(accessToken, true)
	if err != nil {
		return nil, utils.BuildError(err, "failed to check access token expiration")
	}

	isValidRefreshToken, refreshTokenExp, err := utils.CheckTokenExpiration(refreshToken, false)
	if err != nil {
		return nil, utils.BuildError(err, "failed to check refresh token expiration")
	}

	if !isValidAccessToken && isValidRefreshToken {
		newAccessToken, err := RefreshAccessToken(nil, refreshToken)
		if err != nil {
			return nil, utils.BuildError(err, "failed to refresh access token")
		}
		accessToken = *newAccessToken
		isValidAccessToken, accessTokenExp, err = utils.CheckTokenExpiration(accessToken, true)
		if err != nil {
			return nil, utils.BuildError(err, "failed to check new access token expiration")
		}

		SetAccessToken(accessToken, userId)

	}

	if !isValidRefreshToken {
		return nil, utils.BuildError(err, "refresh token is invalid")
	}

	// fetch user by id and add to data
	user, err := services.FetchUserById(userId)

	if err != nil {
		return nil, utils.BuildError(err, "failed to fetch user by id")
	}

	data := map[string]interface{}{
		"isValidAccessToken":  isValidAccessToken,
		"isValidRefreshToken": isValidRefreshToken,
	}

	if environment == "development" {
		data["accessToken"] = accessToken
		data["refreshToken"] = refreshToken
		data["decodedAccessToken"] = decodedAccessToken
		data["decodedRefreshToken"] = decodedRefreshToken
		data["accessTokenExp"] = accessTokenExp
		data["refreshTokenExp"] = refreshTokenExp
		data["user"] = user
	}

	return data, nil
}
