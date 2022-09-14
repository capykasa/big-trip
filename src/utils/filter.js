import { FilterType } from '../const';
import { isFuturePoint } from './point';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point.dateTo)),
};

export { filter };
