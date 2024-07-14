package models

type User struct {
	DBModel
	Name         string `json:"name"`
	Email        string `gorm:"unique" json:"email"`
	Password     string `json:"-"`
	AccessToken  string `json:"-"`
	RefreshToken string `json:"-"`
}
