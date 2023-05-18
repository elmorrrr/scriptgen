export class CustomError extends Error {
  constructor(message, errorCode, context) {
    super(message)
    this.name = "CustomError"
    this.code = errorCode
    this.context = context
  }
}

export class RequiresProPlanError extends Error {
  constructor(message = "This action requires a pro plan") {
    super(message)
    this.name = "RequiresProPlanError"
  }
}

export class AuthRequiredError extends Error {
  constructor(message = "Auth is required to access this page.") {
    super(message)
    this.name = "AuthRequiredError"
    this.message = message
  }
}

export class PermissionDeniedError extends Error {
  constructor(message = "You do not have permission to access this resource.") {
    super(message)
    this.name = "PermissionDeniedError"
    this.message = message
  }
}

export class BadRequestError extends Error {
  constructor(message = "Sorry, your request could not be processed.") {
    super(message)
    this.name = "BadRequestError"
    this.message = message
  }
}

export class DatabaseError extends Error {
  constructor(message = "A database error occurred.") {
    super(message)
    this.name = "DatabaseError"
    this.message = message
  }
}
