package responses

// ErrorResponse represents an error response
type ErrorResponse struct {
	ServiceResponse[any]
}

// NewErrorResponse creates a new ErrorResponse
func NewErrorResponse(message string) ErrorResponse {
	return ErrorResponse{
		ServiceResponse: ServiceResponse[any]{
			Success: false,
			Message: message,
		},
	}
}
