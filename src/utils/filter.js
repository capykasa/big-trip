import { FilterType } from '../const';
import { isFuturePoint } from './point';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point.dateFrom)),
};

export { filter };
