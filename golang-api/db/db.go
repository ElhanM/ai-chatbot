package db

import (
	"github.com/ElhanM/ai-chatbot/envs"
	"gorm.io/gorm"
)

var DB *gorm.DB

func GetGormConnectionString() string {
	return "host=localhost user=" + envs.GetDBUser() + " password=" + envs.GetDBPassword() + " dbname=" + envs.GetDBName() + " port=" + envs.GetDBPort() + " sslmode=disable TimeZone=Europe/Sarajevo"
}
