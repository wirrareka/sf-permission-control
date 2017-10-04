import test from 'ava'

import {
  MemoryAdapter,
  DataAdapterInterface,
  PermissionControl,
  Permission,
  Grant,
  Role,
  RoleNotFoundError,
  PermissionNotFoundError,
  InvalidAttributeTypeError,
  InvalidRoleError,
  InvalidPermissionError
} from 'sf-permission-control'

let adapter: DataAdapterInterface
let permission: Permission
let anotherPermission: Permission
let notGrantedPermission: Permission
let role: Role
let roleIdentity: any = { role: 'test-role' }
let grant: Grant
let anotherGrant: Grant

const prepareAdapter = async () => {
  adapter = new MemoryAdapter({})
  permission = new Permission('test-permission')
  anotherPermission = new Permission('test-permission-another')
  notGrantedPermission = new Permission('test-permission-not-granted')
  role = new Role('test-role')
  grant = new Grant(role, permission)
  anotherGrant = new Grant(role, anotherPermission)
  await adapter.connect()
  await adapter.createPermission(permission)
  await adapter.createPermission(anotherPermission)
  await adapter.createPermission(notGrantedPermission)
  await adapter.createRole(role)
  await adapter.createGrant(grant)
  await adapter.createGrant(anotherGrant)
  return adapter
}

const cleanAdapter = async (adapter: DataAdapterInterface) => {
  return adapter
}

test.serial('initialization', async t => {
  const adapter = await prepareAdapter()
  t.notThrows(async () => {
    const control = new PermissionControl(adapter)
    await control.load()
    await cleanAdapter(adapter)
  })
})

test.serial('should return valid can(role, permission) response with RoleIdentity', async t => {
  try {
    const adapter = await prepareAdapter()
    const control = new PermissionControl(adapter)
    await control.load()
    t.true(control.can(roleIdentity, permission))
    await cleanAdapter(adapter)
  } catch (error) {
    await cleanAdapter(adapter)
    throw error
  }
})

test.serial('should return valid can(role, permission) response with Role', async t => {
  try {
    const adapter = await prepareAdapter()
    const control = new PermissionControl(adapter)
    await control.load()
    t.true(control.can(role, permission))
    await cleanAdapter(adapter)
  } catch (error) {
    await cleanAdapter(adapter)
    throw error
  }
})

test.serial('should return valid can(role, permission) response with role string', async t => {
  try {
    const adapter = await prepareAdapter()
    const control = new PermissionControl(adapter)
    await control.load()
    t.true(control.can('test-role', permission))
    await cleanAdapter(adapter)
  } catch (error) {
    await cleanAdapter(adapter)
    throw error
  }
})

test.serial('can() should return false/denied response on missing Grant', async t => {
  const adapter = await prepareAdapter()
  const control = new PermissionControl(adapter)
  await control.load()
  t.falsy(control.can(role, notGrantedPermission))
  await cleanAdapter(adapter)
})

test.serial('can() should throw InvalidAttributeTypeError when using Permission of unknown type', async t => {
  const adapter = await prepareAdapter()
  const control = new PermissionControl(adapter)
  await control.load()
  const weakMap = new WeakMap<object, string>() // idea to avoid ts strong type checks
  await cleanAdapter(adapter)
  t.throws(() => {
    control.can(weakMap.get({}) as string, permission)
  }, InvalidAttributeTypeError)
})

test.serial('can() should throw InvalidAttributeTypeError when using Role name of zero length', async t => {
  const adapter = await prepareAdapter()
  const control = new PermissionControl(adapter)
  await control.load()
  await cleanAdapter(adapter)
  t.throws(() => {
    control.can({role: ''}, permission)
  }, InvalidRoleError)
})

test.serial('can() should throw InvalidAttributeTypeError when using Permission name of zero length', async t => {
  const adapter = await prepareAdapter()
  const control = new PermissionControl(adapter)
  await control.load()
  await cleanAdapter(adapter)
  t.throws(() => {
    control.can(role, '')
  }, InvalidPermissionError)
})

test.serial('can() should throw InvalidAttributeTypeError when using Role of unknown type', async t => {
  const adapter = await prepareAdapter()
  const control = new PermissionControl(adapter)
  await control.load()
  const weakMap = new WeakMap<object, string>() // idea to avoid ts strong type checks
  await cleanAdapter(adapter)
  t.throws(() => {
    control.can(role, weakMap.get({}) as string)
  }, InvalidAttributeTypeError)
})

test.serial('can() should throw PermissionNotFoundError when calling unknown Permission', async t => {
  const adapter = await prepareAdapter()
  const control = new PermissionControl(adapter)
  await control.load()
  const unknownPermission = new Permission('test-unknown')
  t.throws(() => {
    control.can(role, unknownPermission)
  }, PermissionNotFoundError)
  await cleanAdapter(adapter)
})

test.serial('can() should throw RoleNotFoundError when calling unknown Role', async t => {
  const adapter = await prepareAdapter()
  const control = new PermissionControl(adapter)
  await control.load()
  const unknownRole = new Role('test-unknown-role')
  t.throws(() => {
    control.can(unknownRole, permission)
  }, RoleNotFoundError)
  await cleanAdapter(adapter)
})
