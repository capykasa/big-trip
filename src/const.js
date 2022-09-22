import dayjs from 'dayjs';

const typesOfEvents = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: dayjs().$d,
  dateTo: dayjs().$d,
  destination: null,
  id: null,
  offers: [],
  type: typesOfEvents[0],
  isFavorite: false,
};

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
  BLANK_POINT,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
};
