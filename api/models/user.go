package models

type User struct {
	DBModel
	Name         string `gorm:"not null;unique" json:"name"`
	Email        string `gorm:"not null;unique" json:"email"`
	Password     string `gorm:"not null" json:"-"`
	AccessToken  string `json:"-"`
	RefreshToken string `json:"-"`
}
