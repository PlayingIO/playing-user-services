const Entity = require('mostly-entity');

const GroupEntity = new Entity('Group', {
  displayLabel: { get: 'label' }
});

GroupEntity.discard('_id');

module.exports = GroupEntity.freeze();
