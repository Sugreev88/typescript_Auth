class ValidationError extends Error {
  status: number; // Explicitly declare the status property

  constructor(message: string, status: number = 400) {
    super(message); // Call the parent Error class constructor
    this.name = this.constructor.name; // Set the name to the class name (ValidationError)
    this.status = status; // Assign the status or default to 400
    Error.captureStackTrace(this, this.constructor); // Optional: ensures the stack trace starts from here
  }
}

export default ValidationError;
