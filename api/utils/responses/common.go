package responses

// ResponseStatus represents the status of the response
type ResponseStatus int

const (
	// Success indicates a successful response
	Success ResponseStatus = iota
	// Failed indicates a failed response
	Failed
)
