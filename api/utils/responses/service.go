package responses

// ServiceResponse represents a standard response structure
type ServiceResponse[T any] struct {
	Success    bool   `json:"success"`
	Message    string `json:"message"`
	Results    T      `json:"results"`
	StatusCode int    `json:"statusCode"`
	Count      *int   `json:"count,omitempty"`
}

// NewServiceResponse creates a new ServiceResponse
func NewServiceResponse[T any](status ResponseStatus, message string, results T, statusCode int, count *int) ServiceResponse[T] {
	return ServiceResponse[T]{
		Success:    status == Success,
		Message:    message,
		Results:    results,
		StatusCode: statusCode,
		Count:      count,
	}
}
