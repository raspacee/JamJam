export interface Edge {
  end_location: string;
  distance: number;
  routeIDs: Set<number>;
}

export interface HeapItem {
  name: string;
  priority: number;
}

export interface LocationTuple {
  startAndEnd: {
    startLocation: string;
    endLocation: string;
  };
  locationsVisited: string[];
}

export interface Route {
  routes: string[] | undefined;
  prompts: LocationTuple[] | undefined;
}
