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

func CreateConversation(userID uuid.UUID) (*models.Conversation, error) {
	conversation := &models.Conversation{
		UserID: userID,
		Title:  "",
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

func GenerateBotResponse(conversationID uuid.UUID, userMessage string) (string, error) {
	apiKey := envs.GetOpenAIKey()

	client := openai.NewClient(apiKey)
	ctx := context.Background()

	// Fetch previous messages in the conversation
	var messages []models.Message
	if err := gormDB.DB.Where("conversation_id = ?", conversationID).Order("created_at asc").Find(&messages).Error; err != nil {
		return "", err
	}

	// Prepare messages for the OpenAI API
	var chatMessages []openai.ChatCompletionMessage
	for _, msg := range messages {
		role := "user"
		if msg.Sender == "bot" {
			role = "assistant"
		}
		chatMessages = append(chatMessages, openai.ChatCompletionMessage{
			Role:    role,
			Content: msg.Content,
		})
	}
	chatMessages = append(chatMessages, openai.ChatCompletionMessage{
		Role:    "user",
		Content: userMessage,
	})

	req := openai.ChatCompletionRequest{
		Model:     "gpt-4o-mini",
		Messages:  chatMessages,
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

func GenerateTitle(userMessage string) (string, error) {
	apiKey := envs.GetOpenAIKey()

	client := openai.NewClient(apiKey)
	ctx := context.Background()

	req := openai.ChatCompletionRequest{
		Model: "gpt-4o-mini",
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    "system",
				Content: "Generate a short title for the following conversation:",
			},
			{
				Role:    "user",
				Content: userMessage,
			},
		},
		MaxTokens: 10,
	}

	resp, err := client.CreateChatCompletion(ctx, req)
	if err != nil {
		return "", fmt.Errorf("failed to generate title: %w", err)
	}

	if len(resp.Choices) == 0 {
		return "", fmt.Errorf("no response from OpenAI")
	}

	return resp.Choices[0].Message.Content, nil
}

func HandleNewMessage(conversationID uuid.UUID, userMessage string) (*models.Message, *models.Message, error) {
	// Fetch the conversation
	var conversation models.Conversation
	if err := gormDB.DB.First(&conversation, "id = ?", conversationID).Error; err != nil {
		return nil, nil, err
	}

	// Add user message
	userMsg, err := AddMessage(conversationID, "user", userMessage)
	if err != nil {
		return nil, nil, err
	}

	// Generate bot response
	botResponse, err := GenerateBotResponse(conversationID, userMessage)
	if err != nil {
		return nil, nil, err
	}

	// Add bot message
	botMsg, err := AddMessage(conversationID, "bot", botResponse)
	if err != nil {
		return nil, nil, err
	}

	// Update conversation title if it's empty
	if conversation.Title == "" {
		title, err := GenerateTitle(userMessage)
		if err != nil {
			return nil, nil, err
		}
		conversation.Title = title
		if err := gormDB.DB.Save(&conversation).Error; err != nil {
			return nil, nil, err
		}
	}

	return userMsg, botMsg, nil
}
