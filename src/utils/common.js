const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArray = (a = 0, b = 1, length) => {
  length = parseInt(length, 10) || 0; a = parseInt(a, 10) || 0; b = parseInt(b, 10) || 0;
  if (a === b && length === 1) {
    return [a];
  }
  if (!length) {
    return [];
  }
  const min = a < b ? a : b; const max = a > b ? a : b; const diff = max - min;
  if (length > diff) {
    return [];
  }
  const o = [];
  for (let i = 0; i < length;) {
    const n = getRandomInteger(min, max);
    if (!o.includes(n)) {
      o[i] = n;
      i++;
    }
  }
  return o;
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export {
  getRandomInteger,
  getRandomArray,
  updateItem
};