const typesOfEvents = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const places = ['Amsterdam', 'Geneva', 'Chamonix'];

const FilterType = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export {
  typesOfEvents,
  places,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
};
