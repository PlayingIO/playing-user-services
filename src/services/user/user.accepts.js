const { helpers } = require('mostly-feathers-validate');

module.exports = function accepts (context) {
  const password = { arg: 'password', type: 'string', description: 'Old password', required: true };
  const passwordNew = { arg: 'passwordNew', type: 'string', description: 'New password', required: true };
  const passwordConfirm = { arg: 'passwordConfirm', type: 'string', description: 'Confirm password', required: true };

  return {
    changePassword: [ password, passwordNew, passwordConfirm ]
  };
};