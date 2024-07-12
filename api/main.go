package main

import (
	"github.com/ElhanM/ai-chatbot/db"
	"github.com/ElhanM/ai-chatbot/envs"
	"github.com/ElhanM/ai-chatbot/routes"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string
	Email    string `gorm:"unique"`
	Password string
}

func init() {
	envs.LoadEnv()

	db, err := gorm.Open(postgres.Open(db.GetGormConnectionString()), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database")
	}

	// Migrate the schema
	db.AutoMigrate(&User{})

	// Create
	// db.Create(&User{Name: "Elhan", Email: "elhan.mahmutovic03@gmail.com", Password: "1234"})
}

func setupRouter() *gin.Engine {
	r := gin.Default()

	// Setup routes using the routes package
	routes.SetupRouter(r)

	return r
}

func main() {
	port := envs.GetPort()

	r := setupRouter()
	r.Run(":" + port)
}
