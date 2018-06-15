import dateFn from 'date-fns';
import Entity from 'mostly-entity';

const UserPermissionEntity = new Entity('UserPermission');

UserPermissionEntity.expose('status', {}, (ace) => {
  const now = new Date();
  if (ace.begin || ace.end) {
    if (ace.begin && dateFn.isBefore(now, ace.begin)) return 'pending';
    if (ace.begin && ace.end && dateFn.isWithinRange(now, ace.start, ace.end)) return 'effective';
    if (ace.end && dateFn.isAfter(now, ace.end)) return 'archived';
  }
  return 'effective';
});

UserPermissionEntity.excepts('_id');

export default UserPermissionEntity.asImmutable();
