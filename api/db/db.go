package db

import "github.com/ElhanM/ai-chatbot/envs"

func GetGormConnectionString() string {
	return "host=localhost user=" + envs.GetDBUser() + " password=" + envs.GetDBPassword() + " dbname=" + envs.GetDBName() + " port=" + envs.GetDBPort() + " sslmode=disable TimeZone=Europe/Sarajevo"
}
