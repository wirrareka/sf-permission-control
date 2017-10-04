import test from 'ava'
import { Role } from 'sf-permission-control'

test('Role should initialize', t => {
  t.notThrows(() => {
    return new Role('TestA')
  })
})

test('Role constructor should assign name argument properly', t => {
  const role = new Role('TestA')
  t.truthy(role.name === 'TestA')
})

test('Role constructor should throw error when name argument is missing', t => {
  const weakMap = new WeakMap<object, string>() // idea to avoid ts strong type checks
  t.throws(() => {
    const role = new Role(weakMap.get({}) as string)
    t.truthy(role)
  })
})
