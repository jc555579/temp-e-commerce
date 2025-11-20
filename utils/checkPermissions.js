// 1. It will look for the user that is requesting the resource
// 2. For the resource user ID

const CustomError = require('../errors');

const checkPermissions = (requestUser, resourceUser) => {
  // console.log(requestUser);
  // console.log(resourceUser);
  // console.log(typeof resourceUser);

  // admin is authorized here
  if (requestUser.role === 'admin') return;

  // resource is belong to the right user
  if (requestUser.userId === resourceUser.toString()) return;

  // if it doesn't met the conditions
  throw new CustomError.UnauthorizedError('Not authorized to access this route');
};

module.exports = checkPermissions;