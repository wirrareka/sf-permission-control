import {
  MissingAttributeError,
  InvalidAttributeTypeError,
  ModelValidationError,
  UniqueConstrainViolationError,
  DocumentNotFoundError,
  InvalidRoleError,
  RoleNotFoundError,
  InvalidPermissionError,
  PermissionNotFoundError
} from 'sf-permission-control'

import test from 'ava'

test('Should throw MissingAttributeError', t => {
  t.throws(() => {
    throw new MissingAttributeError('test-attribute')
  }, MissingAttributeError)
})

test('Should throw InvalidAttributeTypeError', t => {
  t.throws(() => {
    throw new InvalidAttributeTypeError('test-attribute')
  }, InvalidAttributeTypeError)
})

test('Should throw ModelValidationError', t => {
  t.throws(() => {
    throw new ModelValidationError([])
  }, ModelValidationError)
})

test('Should throw UniqueConstrainViolationError', t => {
  t.throws(() => {
    throw new UniqueConstrainViolationError('test-message')
  }, UniqueConstrainViolationError)
})

test('Should throw DocumentNotFoundError', t => {
  t.throws(() => {
    throw new DocumentNotFoundError('test-entity', 'test-id')
  }, DocumentNotFoundError)
})

test('Should throw InvalidRoleError', t => {
  t.throws(() => {
    throw new InvalidRoleError('test-role')
  }, InvalidRoleError)
})

test('Should throw RoleNotFoundError', t => {
  t.throws(() => {
    throw new RoleNotFoundError('test-role')
  }, RoleNotFoundError)
})

test('Should throw InvalidPermissionError', t => {
  t.throws(() => {
    throw new InvalidPermissionError('test-permission')
  }, InvalidPermissionError)
})

test('Should throw PermissionNotFoundError', t => {
  t.throws(() => {
    throw new PermissionNotFoundError('test-permission')
  }, PermissionNotFoundError)
})
