const _smallest = (
  xs: number[][],
  i: number,
  used: Set<number>
): Set<number> => {
  if (xs.length == i) return used;
  if (value_in_used(used, xs[i])) {
    return _smallest(xs, i + 1, used);
  }
  return xs[i]
    .map((x) => _smallest(xs, i + 1, new Set([...used, x])))
    .reduce(function (a, b) {
      return a.size <= b.size ? a : b;
    });
};

/* This function takes in a 2D array of route IDs and returns a 1D array that minimizes the route IDs
 * For eg.
 * If this function takes [[1,3 ], [1,2], [4], [4,5]]
 * It will return [1,1,4,4]
 */

export const smallest = (xs: number[][]) => {
  let s = _smallest(xs, 0, new Set());
  return create_result(s, xs);
};

const value_in_used = (used: Set<number>, x: number[]) => {
  for (let i = 0; i < x.length; i++) {
    if (used.has(x[i])) return true;
  }
  return false;
};

const create_result = (s: Set<number>, arr: number[][]) => {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (s.has(arr[i][j])) {
        result.push(arr[i][j]);
        break;
      }
    }
  }
  return result;
};
