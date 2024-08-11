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

// https://platform.openai.com/docs/models
var model = openai.GPT3Dot5Turbo

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

func GenerateBotResponseStream(conversationID uuid.UUID, userMessage string) (*openai.ChatCompletionStream, error) {
	apiKey := envs.GetOpenAIKey()

	client := openai.NewClient(apiKey)
	ctx := context.Background()

	// Fetch previous messages in the conversation
	var messages []models.Message
	if err := gormDB.DB.Where("conversation_id = ?", conversationID).Order("created_at asc").Find(&messages).Error; err != nil {
		return nil, err
	}

	// Add context from previous messages to conversation
	// https://platform.openai.com/docs/guides/chat-completions/getting-started
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

	// https://platform.openai.com/docs/api-referenc  e/streaming
	req := openai.ChatCompletionRequest{
		Model:     model,
		Messages:  chatMessages,
		MaxTokens: 200,
		Stream:    true, // Enable streaming
	}

	stream, err := client.CreateChatCompletionStream(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to generate bot response: %w", err)
	}

	return stream, nil
}

func GenerateTitle(userMessage string) (string, error) {
	apiKey := envs.GetOpenAIKey()

	client := openai.NewClient(apiKey)
	ctx := context.Background()

	req := openai.ChatCompletionRequest{
		Model: model,
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    "system",
				Content: "Generate a short title for the following conversation (you do not need to wrap the title in quotes):",
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

func AddUserMessage(conversationID uuid.UUID, userMessage string) (*models.Message, error) {
	return AddMessage(conversationID, "user", userMessage)
}

func SaveBotResponse(conversationID uuid.UUID, botResponse string) (*models.Message, error) {
	return AddMessage(conversationID, "bot", botResponse)
}

func GenerateTitleIfEmpty(conversationID uuid.UUID, userMessage string) (*string, error) {
	var conversation models.Conversation
	if err := gormDB.DB.First(&conversation, "id = ?", conversationID).Error; err != nil {
		return nil, err
	}

	if conversation.Title == "" {
		title, err := GenerateTitle(userMessage)
		if err != nil {
			return nil, err
		}
		conversation.Title = title
		if err := gormDB.DB.Save(&conversation).Error; err != nil {
			return nil, err
		}
	}
	return &conversation.Title, nil
}

func GetMessages(userID uuid.UUID, conversationID uuid.UUID, limit, offset int) ([]models.Message, int, error) {
	// check if this conversation belongs to this user
	var conversation models.Conversation
	if err := gormDB.DB.First(&conversation, "id = ? AND user_id = ?", conversationID, userID).Error; err != nil {
		return nil, 0, err
	}

	var messages []models.Message
	var count int64

	query := gormDB.DB.Model(&models.Message{}).Where("conversation_id = ?", conversationID).Order("created_at desc")
	query.Count(&count)

	if limit > 0 {
		query = query.Limit(limit)
	}
	if offset > 0 {
		query = query.Offset(offset)
	}
	if err := query.Find(&messages).Error; err != nil {
		return nil, 0, err
	}
	return messages, int(count), nil
}
