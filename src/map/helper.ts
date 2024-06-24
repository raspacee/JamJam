import { smallest } from "./route_solver";
import { Edge, LocationTuple } from "./interface";

/* Returns the intersection between two sets */
export const intersection = (A: Set<number>, B: Set<number>) => {
  const intersection = new Set<number>();
  for (const item of A) {
    if (B.has(item)) {
      intersection.add(item);
    }
  }
  return intersection;
};

/* Returns all of the route's ID that is between any given src and dest location */
export const get_routeIDs = (
  G: Map<string, Edge[]>,
  src: string,
  dest: string
): Set<number> => {
  let edges = G.get(src)!;
  for (let i = 0; i < edges.length; i++) {
    if (edges[i].end_location == dest) {
      return edges[i].routeIDs;
    }
  }
  return new Set([0]);
};

/* This function takes the route locations and their IDs
 * and tries to minimize the times you change the bus.
 * It also generates the prompts for the user to take.
 */
export const create_prompts = (
  locations: string[],
  locations_ids: number[][]
): LocationTuple[] => {
  const minimized_location_ids = smallest(locations_ids);
  const location_tuples: LocationTuple[] = [];
  let left: number; // Variable to hold the index of the front location of the route
  let left_location: string; // Hold the name of the front location
  /* No need to change the bus route. */
  if (
    minimized_location_ids[0] ==
    minimized_location_ids[minimized_location_ids.length - 1]
  ) {
    let result: LocationTuple = {
      startAndEnd: {
        startLocation: locations[0],
        endLocation: locations[locations.length - 1],
      },
      locationsVisited: locations,
    };
    location_tuples.push(result);
  } else {
    left = 0;
    left_location = locations[left];
    locations.shift();
    for (let i = 1; i < locations.length; i++) {
      if (minimized_location_ids[i] == minimized_location_ids[i - 1]) {
        continue;
      } else {
        let result: LocationTuple = {
          startAndEnd: {
            startLocation: left_location,
            endLocation: locations[i - 1],
          },
          locationsVisited: [],
        };
        result.locationsVisited.push(left_location);
        for (let j = left; j <= i - 1; j++) {
          result.locationsVisited.push(locations[j]);
        }
        location_tuples.push(result);
        left = i - 1;
        left_location = locations[left];
      }
    }

    if (left != locations.length - 1) {
      let result: LocationTuple = {
        startAndEnd: {
          startLocation: left_location,
          endLocation: locations[locations.length - 1],
        },
        locationsVisited: [],
      };
      for (let j = left; j <= locations.length - 1; j++) {
        result.locationsVisited.push(locations[j]);
      }
      location_tuples.push(result);
    }
  }
  return location_tuples;
};

export const capitalizeFirstLetter = (word: string) => {
  return word[0].toUpperCase() + word.slice(1);
};
