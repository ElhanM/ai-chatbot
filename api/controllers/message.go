package controllers

import (
	"fmt"
	"io"
	"net/http"
	"strconv"

	"github.com/ElhanM/ai-chatbot/models"
	"github.com/ElhanM/ai-chatbot/services"
	"github.com/ElhanM/ai-chatbot/utils"
	"github.com/ElhanM/ai-chatbot/utils/responses"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func AddMessage(c *gin.Context) {
	var req struct {
		Content string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Invalid request").Error())
		c.JSON(http.StatusBadRequest, errorResponse)
		return
	}

	_, exists := c.Get("user")
	if !exists {
		response := responses.NewErrorResponse("Unauthorized")
		c.JSON(http.StatusUnauthorized, response)
		return
	}

	conversationIDParam := c.Param("conversationId")
	conversationID, err := uuid.Parse(conversationIDParam)
	if err != nil {
		errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Invalid conversation ID").Error())
		c.JSON(http.StatusBadRequest, errorResponse)
		return
	}

	userMessage := req.Content

	// Add user message to the database
	newUserMessage, err := services.AddUserMessage(conversationID, userMessage)
	if err != nil {
		errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Failed to add user message").Error())
		c.JSON(http.StatusInternalServerError, errorResponse)
		return
	}

	// Generate title if empty
	newConvoTitle, err := services.GenerateTitleIfEmpty(conversationID, userMessage)
	if err != nil {
		errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Failed to generate title").Error())
		c.JSON(http.StatusInternalServerError, errorResponse)
		return
	}

	responseData := struct {
		NewConvoTitle  string         `json:"newConvoTitle"`
		NewUserMessage models.Message `json:"newUserMessage"`
	}{
		NewConvoTitle:  *newConvoTitle,
		NewUserMessage: *newUserMessage,
	}

	response := responses.NewServiceResponse(responses.Success, "Message added successfully", responseData, nil)
	c.JSON(http.StatusOK, response)
}

func StreamBotResponse(c *gin.Context) {
	// Set response headers for streaming
	c.Writer.Header().Set("Content-Type", "text/plain")
	c.Writer.Header().Set("Transfer-Encoding", "chunked")

	userMessage := c.Query("content")
	if userMessage == "" {
		c.Writer.Write([]byte("<br /><br />"))
		c.Writer.Write([]byte("**Error:** Missing content parameter\n"))
		return
	}

	_, exists := c.Get("user")
	if !exists {
		c.Writer.Write([]byte("<br /><br />"))
		c.Writer.Write([]byte("**Error:** Unauthorized\n"))
		return
	}

	conversationIDParam := c.Param("conversationId")
	conversationID, err := uuid.Parse(conversationIDParam)
	if err != nil {
		c.Writer.Write([]byte("<br /><br />"))
		c.Writer.Write([]byte(fmt.Sprintf("**Error:** Invalid conversation ID - %v\n", err)))
		return
	}

	// Generate bot response stream
	stream, err := services.GenerateBotResponseStream(conversationID, userMessage)
	if err != nil {
		c.Writer.Write([]byte("<br /><br />"))
		c.Writer.Write([]byte(fmt.Sprintf("**Error:** Failed to generate bot response - %v\n", err)))
		return
	}
	defer stream.Close()

	c.Writer.WriteHeader(http.StatusOK)

	fullBotResponse := ""

	// Read the stream and collect the response
	for {
		response, err := stream.Recv()
		if err != nil {
			if err == io.EOF {
				break
			}
			// Handle error internally without returning a NewErrorResponse
			c.Writer.Write([]byte("<br /><br />"))
			c.Writer.Write([]byte(fmt.Sprintf("**Error:** Failed to generate stream response: %v", err)))
			return
		}
		chunk := response.Choices[0].Delta.Content
		fullBotResponse += chunk
		c.Writer.Write([]byte(chunk))
		c.Writer.(http.Flusher).Flush()
	}

	err = SaveBotResponse(fullBotResponse, conversationID)
	if err != nil {
		c.Writer.Write([]byte("<br /><br />"))
		c.Writer.Write([]byte(fmt.Sprintf("**Error:** Failed to save bot response: %v", err)))
		return
	}
}

func SaveBotResponse(content string, conversationID uuid.UUID) error {
	// Save bot response to the database
	_, err := services.SaveBotResponse(conversationID, content)
	if err != nil {
		errorResponse := utils.BuildError(err, "Failed to save bot response")
		return errorResponse
	}

	return nil
}

func GetMessages(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		response := responses.NewErrorResponse("Unauthorized")
		c.JSON(http.StatusUnauthorized, response)
		return
	}

	conversationIDParam := c.Param("conversationId")
	conversationID, err := uuid.Parse(conversationIDParam)

	if err != nil {
		errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Invalid conversation ID").Error())
		c.JSON(http.StatusBadRequest, errorResponse)
		return
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	switch u := user.(type) {
	case models.User:
		messages, count, err := services.GetMessages(u.ID, conversationID, limit, offset)
		if err != nil {
			errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Failed to get messages").Error())
			c.JSON(http.StatusInternalServerError, errorResponse)
			return
		}

		response := responses.NewServiceResponse(responses.Success, "Messages retrieved", messages, &count)
		c.JSON(http.StatusOK, response)
	default:
		response := responses.NewErrorResponse("Unauthorized")
		c.JSON(http.StatusUnauthorized, response)
	}
}
