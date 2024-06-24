import Heap from "heap";
import { Edge, HeapItem, Route } from "./interface";
import { create_prompts, intersection, get_routeIDs } from "./helper";
import { routes_data } from "./routes";

/* This function builds a adjacency list graph given the route data */
const create_graph = async (): Promise<Map<string, Edge[]>> => {
  let G = new Map<string, Edge[]>();

  try {
    /* Initialize graph */
    for (let row = 0; row < routes_data.length; row++) {
      const line = routes_data[row].split("|");
      for (let i = 1; i < line.length; i++) {
        G.set(line[i].split(",")[0], []);
      }
    }

    /* Fill the graph */
    for (let row = 0; row < routes_data.length; row++) {
      const line = routes_data[row].split("|");
      const routeID = parseInt(line.shift()!);
      for (let i = 0; i < line.length - 1; i++) {
        const start_loc = line[i].split(",")[0];
        let end_loc: string, dist: string;
        [end_loc, dist] = line[i + 1].split(",");
        const distance = 1;

        let found = false;
        let edges = G.get(start_loc)!;
        for (let i = 0; i < edges.length; i++) {
          const e = edges[i];
          if (e.end_location == end_loc) {
            found = true;
            e.routeIDs.add(routeID);
            break;
          }
        }
        if (!found) {
          edges.push({
            end_location: end_loc,
            distance: distance,
            routeIDs: new Set([routeID]),
          });
        }
      }
    }
    return new Promise((resolve) => resolve(G));
  } catch (err) {
    console.error(err);
    return new Promise((resolve, reject) => reject(err));
  }
};

/* Wrapper function that calls others functions */
export const _get_route = (
  G: Map<string, Edge[]>,
  src: string,
  dest: string,
  change_weight: number
): Route | undefined => {
  /* Making sure the graph contains the source
   * and destination location provided by the user
   */
  if (!G.has(src) || !G.has(dest)) {
    return undefined;
  }

  /* prev - A key-value store that holds the previous location to go before reaching a particular location.
   * dist - A key-value store that holds the total distance up to a particular location
   */
  let prev = new Map<string, string | undefined>();
  let dist = new Map<string, number>();

  if (run_dijkstra(G, src, dest, change_weight, prev, dist)) {
    const S = build_route_from_prev(dest, prev, dist);
    const arr = build_route_array(G, S);

    const prompts = create_prompts(S, arr);
    return {
      routes: S,
      prompts,
    };
  } else {
    /* If route is not found return undefined */
    return undefined;
  }
};

/* Even I forgot what this function does */
const build_route_array = (G: Map<string, Edge[]>, S: string[]): number[][] => {
  let result: number[][] = [];
  for (let i = 0; i < S.length - 1; i++) {
    let set = G.get(S[i])?.filter((s) => s.end_location == S[i + 1])[0]
      .routeIDs;
    let tmp = [];
    for (const key of set!.values()) {
      tmp.push(key);
    }
    result.push(tmp);
  }
  return result;
};

/* This function builds the bus route from the prev variable */
const build_route_from_prev = (
  dest: string,
  prev: Map<string, string | undefined>,
  dist: Map<string, number>
) => {
  let S: string[] = [];
  let u: string | undefined = dest;
  while (u != undefined) {
    S.unshift(u);
    u = prev.get(u);
  }
  return S;
};

/* This function runs the modified dijkstra algorithm on the graph.
 * Returns true if a route was found else returns false.
 * G - graph
 * src - source location provided by user
 * dest - destination location provided by user
 * change_weight - how much weight to add when a bus route change is detected.
 *                 its value is provided in meters, as the graph's weight is measured in meters instead of km.
 * prev - A key-value store that holds the previous location to go before reaching a location.
 * dist - A key-value store that holds the total distance up to that location
 */
const run_dijkstra = (
  G: Map<string, Edge[]>,
  src: string,
  dest: string,
  change_weight: number,
  prev: Map<string, string | undefined>,
  dist: Map<string, number>
): boolean => {
  /* Heap is used to increase the speed of dijkstra */
  let queue = new Heap(function (a: HeapItem, b: HeapItem) {
    return a.priority - b.priority;
  });

  dist.set(src, 0);
  queue.push({ name: src, priority: 0 });

  for (const key of G.keys()) {
    if (key !== src) {
      prev.set(key, undefined);
      dist.set(key, Infinity);
      queue.push({ name: key, priority: Infinity });
    }
  }

  while (!queue.empty()) {
    const u: string = queue.pop()!.name;

    if (u == dest) {
      return true;
    }

    let neighbours = G.get(u)!;
    for (let i = 0; i < neighbours.length; i++) {
      const v = neighbours[i];
      let alt = dist.get(u)! + v.distance;
      let route_changed = false;

      /* If route change is detected, add additional cost */
      /* Imagine x -> u -> v, 
        then we only need to compare routeIDs of xu and uv 
      */
      if (u != src) {
        const x = prev.get(u);
        if (x == undefined) {
          return false;
        }
        const xu_routeIDs = get_routeIDs(G, x, u);
        const uv_routeIDs = get_routeIDs(G, u, v.end_location);
        /* If there is no intersection the two sets of route IDs between xu and uv
         * then it means there is a route change
         */
        if (intersection(xu_routeIDs, uv_routeIDs).size == 0) {
          alt += change_weight;
          route_changed = true;
        }
      }

      if (alt < dist.get(v.end_location)!) {
        prev.set(v.end_location, u);
        dist.set(v.end_location, alt);
        /* lots of typescript hack */
        //@ts-ignore
        for (let i = 0; i < queue.nodes.length; i++) {
          //@ts-ignore
          if (queue.nodes[i].name == v.end_location) {
            //@ts-ignore
            queue.nodes[i].priority = alt;
            //@ts-ignore
            if (route_changed) queue.nodes[i].priority -= change_weight;
            break;
          }
        }
        queue.heapify();
      }
    }
  }

  return false;
};

export const get_route = async (
  from: string,
  to: string
): Promise<Route | undefined> => {
  try {
    let G = await create_graph();
    return _get_route(G, from, to, 300);
  } catch (err) {
    return undefined;
  }
};
