import Entity from 'mostly-entity';

const RoleEntity = new Entity('Role', {
  type: { default: 'role' },
  displayLabel: { get: 'label' }
});

RoleEntity.excepts('createdAt', 'updatedAt', 'destroyedAt');

export default RoleEntity.asImmutable();