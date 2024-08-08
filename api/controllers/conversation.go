package controllers

import (
	"net/http"
	"strconv"

	"github.com/ElhanM/ai-chatbot/models"
	"github.com/ElhanM/ai-chatbot/services"
	"github.com/ElhanM/ai-chatbot/utils"
	"github.com/ElhanM/ai-chatbot/utils/responses"
	"github.com/gin-gonic/gin"
)

func GetLatestConversation(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		response := responses.NewErrorResponse("Unauthorized")
		c.JSON(http.StatusUnauthorized, response)
		return
	}

	switch u := user.(type) {
	case models.User:
		conversation, err := services.GetLatestConversation(u.ID)
		if err != nil {
			errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Failed to get latest conversation").Error())
			c.JSON(http.StatusInternalServerError, errorResponse)
			return
		}

		response := responses.NewServiceResponse(responses.Success, "Latest conversation retrieved", conversation, nil)
		c.JSON(http.StatusOK, response)
	default:
		response := responses.NewErrorResponse("Unauthorized")
		c.JSON(http.StatusUnauthorized, response)
	}
}

func GetConversations(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		response := responses.NewErrorResponse("Unauthorized")
		c.JSON(http.StatusUnauthorized, response)
		return
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	switch u := user.(type) {
	case models.User:
		conversations, count, err := services.GetConversations(u.ID, limit, offset)
		if err != nil {
			errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Failed to get conversations").Error())
			c.JSON(http.StatusInternalServerError, errorResponse)
			return
		}

		response := responses.NewServiceResponse(responses.Success, "Conversations retrieved", conversations, &count)
		c.JSON(http.StatusOK, response)
	default:
		response := responses.NewErrorResponse("Unauthorized")
		c.JSON(http.StatusUnauthorized, response)
	}
}

func CreateConversation(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		response := responses.NewErrorResponse("Unauthorized")
		c.JSON(http.StatusUnauthorized, response)
		return
	}

	switch u := user.(type) {
	case models.User:
		conversation, err := services.CreateConversation(u.ID)
		if err != nil {
			errorResponse := responses.NewErrorResponse(utils.BuildError(err, "Failed to create conversation").Error())
			c.JSON(http.StatusInternalServerError, errorResponse)
			return
		}

		response := responses.NewServiceResponse(responses.Success, "Conversation created", conversation, nil)
		c.JSON(http.StatusOK, response)
	default:
		response := responses.NewErrorResponse("Unauthorized")
		c.JSON(http.StatusUnauthorized, response)
	}
}
