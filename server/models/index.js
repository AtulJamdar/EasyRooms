/**
 * Convenient access to all Mongoose models.
 *
 * Importing this file ensures all models are registered with Mongoose and
 * provides a single import location.
 */
module.exports = {
  User: require('./User'),
  RoomPost: require('./RoomPost'),
  RoomRequirement: require('./RoomRequirement'),
  Report: require('./Report'),
  RoommateRequest: require('./RoommateRequest'),
};
