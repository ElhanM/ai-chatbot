package utils

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBuildError(t *testing.T) {
	tests := []struct {
		err      error
		msg      string
		expected string
	}{
		{errors.New("original error"), "", "Internal server error: original error"},
		{nil, "custom message", "custom message"},
		{errors.New("original error"), "custom message", "custom message: original error"},
	}

	for _, tt := range tests {
		result := BuildError(tt.err, tt.msg)
		assert.EqualError(t, result, tt.expected)
	}
}
