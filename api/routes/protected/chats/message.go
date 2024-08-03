package routes

import (
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

func addMessage(c *gin.Context) {
	// TODO: add streaming
	// TODO: add code blocks to frontend
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

	userMsg, botMsg, err := services.HandleNewMessage(conversationID, userMessage)
	if err != nil {
		errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Failed to add message").Error())
		c.JSON(http.StatusInternalServerError, errorResponse)
		return
	}

	response := responses.NewServiceResponse(responses.Success, "Messages added", gin.H{
		"userMessage": userMsg,
		"botMessage":  botMsg,
	}, nil)
	c.JSON(http.StatusOK, response)
}
