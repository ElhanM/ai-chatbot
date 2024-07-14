package utils

import (
	"errors"
	"fmt"
)

func BuildError(err error, msg string) error {
	defaultMsg := "Internal server error"
	var errMsg string

	if msg != "" {
		errMsg = fmt.Sprintf("%s: %v", msg, err)
	} else {
		errMsg = fmt.Sprintf("%s: %v", defaultMsg, err)
	}

	return errors.New(errMsg)
}
