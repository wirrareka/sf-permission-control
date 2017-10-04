import test from 'ava'

import {
  MemoryAdapter,
  DataAdapterInterface,
  Permission,
  Role,
  Grant,
  ModelValidationError
} from 'sf-permission-control'

let adapter: DataAdapterInterface
let permission: Permission
let role: Role
let grant: Grant

test.serial('initialization', async t => {
  adapter = new MemoryAdapter({})
  await adapter.connect()
  t.truthy(adapter.connected)
})

test.serial('should pass migrate request', async t => {
  await adapter.migrate()
  t.truthy(adapter.connected)
})

// Permission

test.serial('should have no Permission records yet', async t => {
  const permissions = await adapter.getPermissions()
  t.truthy(permissions.length === 0)
})

test.serial('should create Permission', async t => {
  permission = new Permission('test')
  t.notThrows(async () => {
    await adapter.createPermission(permission)
    const saved = await adapter.getPermissions()
    t.truthy(saved.length === 1)
  })
})

test.serial('should remove previously created Permission', async t => {
  const result = await adapter.removePermission(permission)
  const saved = await adapter.getPermissions()
  t.truthy(result === 1)
  t.truthy(saved.length === 0)
})

// Role

test.serial('should have no Role records yet', async t => {
  const roles = await adapter.getRoles()
  t.truthy(roles.length === 0)
})

test.serial('should create Role', async t => {
  role = new Role('test')
  t.notThrows(async () => {
    await adapter.createRole(role)
    const saved = await adapter.getRoles()
    t.truthy(saved.length === 1)
  })
})

test.serial('should remove previously created Role', async t => {
  const result = await adapter.removeRole(role)
  const saved = await adapter.getRoles()
  t.truthy(result === 1)
  t.truthy(saved.length === 0)
})

// Grant

test.serial('should have no Grant records yet', async t => {
  const grants = await adapter.getGrants()
  t.truthy(grants.length === 0)
})

test.serial('should create Grant', async t => {
  grant = new Grant(role, permission)
  t.notThrows(async () => {
    await adapter.createGrant(grant)
    const saved = await adapter.getGrants()
    t.truthy(saved.length === 1)
  })
})

test.serial('should remove previously created Grant', async t => {
  const result = await adapter.removeGrant(grant)
  const saved = await adapter.getGrants()
  t.truthy(result === 1)
  t.truthy(saved.length === 0)
})

// we skip this test on memory adapter as its too simple to handle explicit indexes
// test.serial('should throw UniqueConstrainViolationError on same Role', async t => {
//   await adapter.createRole(role)
//   const sameRole = new Role(role.name)
//   try {
//     await adapter.createRole(sameRole)
//   } catch (error) {
//     t.true(error instanceof UniqueConstrainViolationError)
//   }
// })

test.serial('should throw validation error', async t => {
  const weakMap = new WeakMap<object, string>()
  const permission = new Permission('something')
  permission.name = weakMap.get({}) as string

  try {
    await adapter.createPermission(permission)
  } catch (error) {
    t.true(error instanceof ModelValidationError)
  }
})
