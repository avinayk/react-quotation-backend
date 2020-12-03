module.exports = {
  superadmin: [
    '/api/roles',
    '/api/users',
    '/api/posts',
    '/api/medias',
    '/api/entity-role-permissions',
    '/api/permissions',
    '/api/subscribers',
    '/api/trashed-items',
  ],
  admin: ['/api/roles', '/api/users', '/api/posts', '/api/medias', '/api/entity-role-permissions'],
  moderator: ['/api/posts', '/api/medias', '/api/entity-role-permissions'],
};
