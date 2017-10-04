import test from 'ava'
import { Permission } from 'sf-permission-control'

test('Permission should initialize', t => {
  t.notThrows(() => {
    return new Permission('TestA')
  })
})

test('Permission constructor should assign name argument properly', t => {
  const permission = new Permission('TestA')
  t.truthy(permission.name === 'TestA')
})

test('Permission constructor should throw error when name argument is missing', t => {
  const weakMap = new WeakMap<object, string>()
  t.throws(() => {
    const permission = new Permission(weakMap.get({}) as string)
    t.truthy(permission)
  })
})
