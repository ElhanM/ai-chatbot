package main

import (
	"fmt"
	"time"

	gormDB "github.com/ElhanM/ai-chatbot/db"
	"github.com/ElhanM/ai-chatbot/envs"
	"github.com/ElhanM/ai-chatbot/models"
	"github.com/ElhanM/ai-chatbot/routes"
	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload" // autoload package to load .env file
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func init() {
	var err error
	gormDB.DB, err = gorm.Open(postgres.Open(gormDB.GetGormConnectionString()), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database")
	}

	// TODO: Move to a separate package
	// Migrate the schema
	err = gormDB.DB.AutoMigrate(&models.User{})
	if err != nil {
		errMsg := fmt.Sprintf("failed to migrate schema: %v", err)
		panic(errMsg)
	}
}

func setupRouter() *gin.Engine {
	r := gin.Default()

	// Setup routes using the routes package
	routes.SetupRouter(r)

	return r
}

func main() {
	fmt.Println(time.Hour * 1)

	port := envs.GetPort()

	r := setupRouter()
	r.Run(":" + port)
}
