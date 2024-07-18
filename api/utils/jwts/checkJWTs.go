package jwts

import (
	"github.com/ElhanM/ai-chatbot/envs"
	"github.com/ElhanM/ai-chatbot/models"
	"github.com/ElhanM/ai-chatbot/services"
	"github.com/ElhanM/ai-chatbot/utils"
	"github.com/google/uuid"
)

// CheckJWTs checks the validity of JWTs and returns relevant data and an error if any.
func CheckJWTs(userIdStr string) (map[string]interface{}, error) {
	environment := envs.GetEnvironment()

	userId, err := uuid.Parse(userIdStr)
	if err != nil {
		return nil, utils.BuildError(err, "invalid user ID format")
	}

	// accessToken, refreshToken := GetAccessToken(userId), GetRefreshToken(userId)
  accessToken, err := GetAccessToken(userId)
  if err != nil {
    return nil, utils.BuildError(err, "failed to get access token")
  }

  refreshToken, err := GetRefreshToken(userId)
  if err != nil {
    return nil, utils.BuildError(err, "failed to get refresh token")
  }

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
		err = handleExpiredAccessToken(&accessToken, refreshToken, userId, &isValidAccessToken, &accessTokenExp)
		if err != nil {
			return nil, utils.BuildError(err, "failed to handle expired access token")
		}
	}

	if !isValidRefreshToken {
		return nil, utils.BuildError(err, "refresh token is invalid")
	}

	// fetch user by id and add to data
	user, err := services.FetchUserById(userId)

	if err != nil {
		return nil, utils.BuildError(err, "failed to fetch user by id")
	}

	var data map[string]interface{}
	populateData(&data, isValidAccessToken, isValidRefreshToken, accessToken, refreshToken, decodedAccessToken, decodedRefreshToken, accessTokenExp, refreshTokenExp, user, environment)

	return data, nil
}

func populateData(data *map[string]interface{}, isValidAccessToken, isValidRefreshToken bool, accessToken, refreshToken string, decodedAccessToken, decodedRefreshToken map[string]interface{}, accessTokenExp, refreshTokenExp string, user *models.User, environment string) {
	*data = map[string]interface{}{
		"isValidAccessToken":  isValidAccessToken,
		"isValidRefreshToken": isValidRefreshToken,
	}

	if environment == "development" {
		(*data)["accessToken"] = accessToken
		(*data)["refreshToken"] = refreshToken
		(*data)["decodedAccessToken"] = decodedAccessToken
		(*data)["decodedRefreshToken"] = decodedRefreshToken
		(*data)["accessTokenExp"] = accessTokenExp
		(*data)["refreshTokenExp"] = refreshTokenExp
		(*data)["user"] = *user
	}
}

func handleExpiredAccessToken(accessToken *string, refreshToken string, userId uuid.UUID, isValidAccessToken *bool, accessTokenExp *string) error {
	newAccessToken, err := RefreshAccessToken(nil, refreshToken)
	if err != nil {
		return utils.BuildError(err, "failed to refresh access token")
	}
	*accessToken = *newAccessToken

	// Perform dereferencing correctly for assignment
	var valid bool
	var expiration string
	valid, expiration, err = utils.CheckTokenExpiration(*accessToken, true)
	if err != nil {
		return utils.BuildError(err, "failed to check new access token expiration")
	}

	// Assign values to the pointers
	*isValidAccessToken = valid
	*accessTokenExp = expiration

	SetAccessToken(*accessToken, userId)

	return nil
}
