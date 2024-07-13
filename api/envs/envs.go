package envs

import (
	"os"
)

func GetPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = "5019"
	}
	return port
}

func GetDBUser() string {
	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		panic("DB_USER environment variable is not set")
	}
	return dbUser
}

func GetDBPassword() string {
	dbPassword := os.Getenv("DB_PASSWORD")
	if dbPassword == "" {
		panic("DB_PASSWORD environment variable is not set")
	}
	return dbPassword
}

func GetDBName() string {
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		panic("DB_NAME environment variable is not set")
	}
	return dbName
}

func GetDBPort() string {
	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		panic("DB_PORT environment variable is not set")
	}
	return dbPort
}

func GetAccessTokenSecret() string {
	accessTokenSecret := os.Getenv("ACCESS_TOKEN_SECRET")

	if accessTokenSecret == "" {
		panic("ACCESS_TOKEN_SECRET environment variable is not set")
	}
	return accessTokenSecret
}

func GetRefreshTokenSecret() string {
	refreshTokenSecret := os.Getenv("REFRESH_TOKEN_SECRET")
	if refreshTokenSecret == "" {
		panic("REFRESH_TOKEN_SECRET environment variable is not set")
	}
	return refreshTokenSecret
}

func GetEnvironment() string {
	env := os.Getenv("ENVIRONMENT")
	if env == "" {
		env = "development"
	}
	return env
}
