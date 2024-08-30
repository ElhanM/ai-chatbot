package responses

type ErrorResponse struct {
	ServiceResponse[any]
	ErrorCode string `json:"errorCode,omitempty"`
}

// NewErrorResponse creates a new ErrorResponse
func NewErrorResponse(message string) ErrorResponse {
	return ErrorResponse{
		ServiceResponse: ServiceResponse[any]{
			Success: false,
			Message: message,
			Results: struct{}{},
		},
	}
}
