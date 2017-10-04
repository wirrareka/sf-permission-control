import { ValidationError } from 'class-validator'

export class MissingAttributeError extends Error {
  attribute: string
  constructor (attribute: string) {
    super(`'${attribute}' attribute is missing`)
    this.name = 'MissingAttributeError'
    this.attribute = attribute
  }
}

export class InvalidAttributeTypeError extends Error {
  attribute: string
  constructor (attribute: string) {
    super(`'${attribute}' attribute is wrong type`)
    this.name = 'InvalidAttributeTypeError'
    this.attribute = attribute
  }
}

// DataAdapter errors
export class ModelValidationError extends Error {
  errors: ValidationError[]
  constructor (errors: ValidationError[]) {
    super('ModelValidationError')
    this.message = JSON.stringify(errors, null, 4)
    this.errors = errors
  }
}

export class UniqueConstrainViolationError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'UniqueConstrainViolationError'
  }
}

export class DocumentNotFoundError extends Error {
  entity: string
  id: string

  constructor (entity: string, id: string) {
    super(`DocumentNotFoundError: ${entity} id: ${id} not found`)
    this.entity = entity
    this.id = id
  }
}

// PermissionControl errors
export class InvalidRoleError extends Error {
  role: any

  constructor (role: any) {
    super(`InvalidRoleError: role: ${role} is invalid`)
    this.role = role
  }
}

export class RoleNotFoundError extends Error {
  role: any

  constructor (role: any) {
    super(`RoleNotFoundError: role: ${role} not found`)
    this.role = role
  }
}

export class InvalidPermissionError extends Error {
  permission: any

  constructor (permission: any) {
    super(`InvalidPermissionError: permission: ${permission} is invalid`)
    this.permission = permission
  }
}

export class PermissionNotFoundError extends Error {
  permission: any

  constructor (permission: any) {
    super(`RoleNotFoundError: permission: ${permission} not found`)
    this.permission = permission
  }
}
