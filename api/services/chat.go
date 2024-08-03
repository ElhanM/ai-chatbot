package services

import (
	"context"
	"fmt"

	gormDB "github.com/ElhanM/ai-chatbot/db"
	"github.com/ElhanM/ai-chatbot/envs"
	"github.com/ElhanM/ai-chatbot/models"
	"github.com/google/uuid"
	openai "github.com/sashabaranov/go-openai"
)

func CreateConversation(userID uuid.UUID, title string) (*models.Conversation, error) {
	conversation := &models.Conversation{
		UserID: userID,
		Title:  title,
	}
	if err := gormDB.DB.Create(conversation).Error; err != nil {
		return nil, err
	}
	return conversation, nil
}

func AddMessage(conversationID uuid.UUID, sender, content string) (*models.Message, error) {
	message := &models.Message{
		ConversationID: conversationID,
		Sender:         sender,
		Content:        content,
	}
	if err := gormDB.DB.Create(message).Error; err != nil {
		return nil, err
	}
	return message, nil
}

func GenerateBotResponse(userMessage string) (string, error) {
	apiKey := envs.GetOpenAIKey()

	client := openai.NewClient(apiKey)
	ctx := context.Background()

	req := openai.ChatCompletionRequest{
		Model: openai.GPT3Dot5Turbo,
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    "user",
				Content: userMessage,
			},
		},
		MaxTokens: 150,
	}

	resp, err := client.CreateChatCompletion(ctx, req)
	if err != nil {
		return "", fmt.Errorf("failed to generate bot response: %w", err)
	}

	if len(resp.Choices) == 0 {
		return "", fmt.Errorf("no response from OpenAI")
	}

	return resp.Choices[0].Message.Content, nil
}

func HandleNewMessage(conversationID uuid.UUID, userMessage string) (*models.Message, *models.Message, error) {
	userMsg, err := AddMessage(conversationID, "user", userMessage)
	if err != nil {
		return nil, nil, err
	}

	botResponse, err := GenerateBotResponse(userMessage)
	if err != nil {
		return nil, nil, err
	}

	botMsg, err := AddMessage(conversationID, "bot", botResponse)
	if err != nil {
		return nil, nil, err
	}

	return userMsg, botMsg, nil
}
