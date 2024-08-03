package routes

import (
	"fmt"
	"io"
	"net/http"

	"github.com/ElhanM/ai-chatbot/services"
	"github.com/ElhanM/ai-chatbot/utils"
	"github.com/ElhanM/ai-chatbot/utils/responses"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func MessageRoutes(r *gin.RouterGroup) {
	r.POST("/message/:conversationId", addMessage)
}

// TODO: add code blocks and markdown to frontend
func addMessage(c *gin.Context) {
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
	_, err = services.AddUserMessage(conversationID, userMessage)
	if err != nil {
		errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Failed to add user message").Error())
		c.JSON(http.StatusInternalServerError, errorResponse)
		return
	}

	// Generate bot response stream
	stream, err := services.GenerateBotResponseStream(conversationID, userMessage)
	if err != nil {
		errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Failed to generate bot response").Error())
		c.JSON(http.StatusInternalServerError, errorResponse)
		return
	}
	defer stream.Close()

	// Set response headers for streaming
	c.Writer.Header().Set("Content-Type", "application/json")
	c.Writer.Header().Set("Transfer-Encoding", "chunked")
	c.Writer.WriteHeader(http.StatusOK)

	// Read the stream and collect the response
	var botResponse string
	for {

		response, err := stream.Recv()
		if err != nil {
			if err == io.EOF {
				break
			}
			c.Writer.Write([]byte("<br /><br />"))
			c.Writer.Write([]byte(fmt.Sprintf("BOOM! 💥 Error receiving stream response: %v", err)))
			return
		}
		chunk := response.Choices[0].Delta.Content
		botResponse += chunk
		c.Writer.Write([]byte(chunk))
		c.Writer.(http.Flusher).Flush()
	}

	// Save bot response to the database
	_, err = services.SaveBotResponse(conversationID, botResponse)
	if err != nil {
		errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Failed to save bot response").Error())
		c.JSON(http.StatusInternalServerError, errorResponse)
		return
	}

	// Generate title if empty
	err = services.GenerateTitleIfEmpty(conversationID, userMessage)
	if err != nil {
		errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Failed to generate title").Error())
		c.JSON(http.StatusInternalServerError, errorResponse)
		return
	}
}
