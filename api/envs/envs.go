package envs

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// LoadEnv loads the environment variables from .env file
func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

// GetPort returns the PORT environment variable
func GetPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
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
