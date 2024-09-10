package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestHashPassword(t *testing.T) {
	password := "mysecretpassword"
	hashedPassword, err := HashPassword(password)
	assert.NoError(t, err)
	assert.NotEmpty(t, hashedPassword)
}

func TestCheckPasswordHash(t *testing.T) {
	password := "mysecretpassword"
	hashedPassword, err := HashPassword(password)
	assert.NoError(t, err)

	isValid := CheckPasswordHash(password, hashedPassword)
	assert.True(t, isValid)

	isInvalid := CheckPasswordHash("wrongpassword", hashedPassword)
	assert.False(t, isInvalid)
}
