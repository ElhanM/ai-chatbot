package seeders

import (
	"log"
	"strconv"

	gormDB "github.com/ElhanM/ai-chatbot/db"
	"github.com/ElhanM/ai-chatbot/models"
	"github.com/ElhanM/ai-chatbot/utils"
	"github.com/google/uuid"
)

func SeedDatabase() error {
	db := gormDB.DB

	// Delete existing data
	if err := db.Exec("DELETE FROM messages").Error; err != nil {
		return err
	}
	if err := db.Exec("DELETE FROM conversations").Error; err != nil {
		return err
	}
	if err := db.Exec("DELETE FROM users").Error; err != nil {
		return err
	}

	// Define the number of entries to create
	numConversations := 20
	numUsers := 20
	numMessages := 20

	hashedPassword, err := utils.HashPassword("1234")
	if err != nil {
		return err
	}

	// Create and insert dummy data
	for i := 0; i < numUsers; i++ {
		user := models.User{
			DBModel:  models.DBModel{ID: uuid.New()},
			Name:     "user" + strconv.Itoa(i),
			Email:    "user" + strconv.Itoa(i) + "@example.com",
			Password: hashedPassword,
		}
		if err := db.Create(&user).Error; err != nil {
			return err
		}

		// Set the number of conversations for user 1 to 50
		conversationsToCreate := numConversations
		if i == 1 {
			conversationsToCreate = 50
		}

		for j := 0; j < conversationsToCreate; j++ {
			conversation := models.Conversation{
				DBModel: models.DBModel{ID: uuid.New()},
				UserID:  user.ID,
				Title:   "Conversation" + strconv.Itoa(j) + " of User" + strconv.Itoa(i),
			}
			if err := db.Create(&conversation).Error; err != nil {
				return err
			}

			for k := 0; k < numMessages; k++ {
				sender := "user"
				if k%2 == 1 {
					sender = "bot"
				}
				message := models.Message{
					DBModel:        models.DBModel{ID: uuid.New()},
					ConversationID: conversation.ID,
					Sender:         sender,
					Content:        "Message" + strconv.Itoa(k) + " of Conversation" + strconv.Itoa(j) + " of User" + strconv.Itoa(i),
				}
				if err := db.Create(&message).Error; err != nil {
					return err
				}
			}
		}
	}

	log.Println("Database seeded successfully")
	return nil
}
