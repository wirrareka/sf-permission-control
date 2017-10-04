import test from 'ava'
import { Grant, Permission, Role, MissingAttributeError, InvalidAttributeTypeError } from 'sf-permission-control'

const permission = new Permission('test-a')
const role = new Role('role-a')

test('Grant should initialize', t => {
  t.notThrows(() => {
    return new Grant(role, permission)
  })
})

test('Grant constructor should assign role and permission arguments properly', t => {
  const grant = new Grant(role, permission)
  t.truthy(grant.role.name === role.name)
  t.truthy(grant.permission.name === permission.name)
})

test('Grant constructor should throw error without arguments', t => {
  t.throws(() => {
    return new Grant(undefined, undefined)
  }, MissingAttributeError)
})

test('Grant constructor should throw error without Permission', t => {
  t.throws(() => {
    return new Grant(role, undefined)
  }, MissingAttributeError)
})

test('Grant constructor should throw error without Role', t => {
  t.throws(() => {
    return new Grant(undefined, permission)
  }, MissingAttributeError)
})

test('Grant constructor should throw error with invalid Role type', t => {
  t.throws(() => {
    const wrongRole = {} as Role
    return new Grant(wrongRole, permission)
  }, InvalidAttributeTypeError)
})

test('Grant constructor should throw error with invalid Permission type', t => {
  t.throws(() => {
    const wrongPermission = {} as Permission
    return new Grant(role, wrongPermission)
  }, InvalidAttributeTypeError)
})
