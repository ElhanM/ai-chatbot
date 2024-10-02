package envs

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetPort(t *testing.T) {
	os.Setenv("PORT", "8080")
	assert.Equal(t, "8080", GetPort())

	os.Unsetenv("PORT")
	assert.Equal(t, "5019", GetPort())
}

func TestGetDBUser(t *testing.T) {
	os.Setenv("DB_USER", "testuser")
	assert.Equal(t, "testuser", GetDBUser())

	os.Unsetenv("DB_USER")
	assert.Panics(t, func() { GetDBUser() })
}

func TestGetDBPassword(t *testing.T) {
	os.Setenv("DB_PASSWORD", "testpassword")
	assert.Equal(t, "testpassword", GetDBPassword())

	os.Unsetenv("DB_PASSWORD")
	assert.Panics(t, func() { GetDBPassword() })
}

func TestGetDBName(t *testing.T) {
	os.Setenv("DB_NAME", "testdb")
	assert.Equal(t, "testdb", GetDBName())

	os.Unsetenv("DB_NAME")
	assert.Panics(t, func() { GetDBName() })
}

func TestGetDBPort(t *testing.T) {
	os.Setenv("DB_PORT", "5432")
	assert.Equal(t, "5432", GetDBPort())

	os.Unsetenv("DB_PORT")
	assert.Panics(t, func() { GetDBPort() })
}

func TestGetAccessTokenSecret(t *testing.T) {
	os.Setenv("ACCESS_TOKEN_SECRET", "supersecret")
	assert.Equal(t, "supersecret", GetAccessTokenSecret())

	os.Unsetenv("ACCESS_TOKEN_SECRET")
	assert.Panics(t, func() { GetAccessTokenSecret() })
}

func TestGetRefreshTokenSecret(t *testing.T) {
	os.Setenv("REFRESH_TOKEN_SECRET", "superdupersecret")
	assert.Equal(t, "superdupersecret", GetRefreshTokenSecret())

	os.Unsetenv("REFRESH_TOKEN_SECRET")
	assert.Panics(t, func() { GetRefreshTokenSecret() })
}

func TestGetEnvironment(t *testing.T) {
	os.Setenv("ENVIRONMENT", "production")
	assert.Equal(t, "production", GetEnvironment())

	os.Unsetenv("ENVIRONMENT")
	assert.Equal(t, "development", GetEnvironment())
}

func TestGetOpenAIKey(t *testing.T) {
	os.Setenv("OPENAI_KEY", "sensitivekey")
	assert.Equal(t, "sensitivekey", GetOpenAIKey())

	os.Unsetenv("OPENAI_KEY")
	assert.Panics(t, func() { GetOpenAIKey() })
}

func TestGetExpiredToken(t *testing.T) {
	os.Setenv("EXPIRED_TOKEN", "expiredtoken")
	assert.Equal(t, "expiredtoken", GetExpiredToken())

	os.Unsetenv("EXPIRED_TOKEN")
	assert.Panics(t, func() { GetExpiredToken() })
}
