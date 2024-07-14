package utils

import (
	"errors"
	"fmt"

	"github.com/ElhanM/ai-chatbot/envs"
)

func BuildError(err error, msg string) error {
	environment := envs.GetEnvironment()

	defaultMsg := "Internal server error"
	var errMsg string

	if environment == "production" {
		err = nil
	}

	if msg != "" {
		errMsg = fmt.Sprintf("%s: %v", msg, err)
	} else {
		errMsg = fmt.Sprintf("%s: %v", defaultMsg, err)
	}

	return errors.New(errMsg)
}
