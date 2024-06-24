/* Each route is assigned a unique ID
 * Each location is separated by a pipe symbol (|)
 * Inside the route (a, b), 'a' represents location name and 'b' represents the distance to 'b' from 'a' in meters
 */
export const routes_data = [
  "1|swoyambhu,0|sitapaila,900|bafal,550|syuchatar,450|kalanki,800|solteemode,1200|kalimati,600|teku hospital,750|tripureswor-1,500|rnac bus stop,1300|jamal,800",
  "2|raniban bus station,0|radha-krishna mandir,900|dhungedhara,1200|banasthali,400|balaju,750|sasa banquet,650|sorakhutte,280|thamel,280|lainchaur,400|jamal,1200|rnac bus stop,1800",
  "3|swoyambhu,0|dhungedhara,1400|banasthali,400|balaju,750|sasa banquet,650|sorakhutte,280|thamel,280|lainchaur,400|jamal,1200|rnac bus stop,1800",
  "4|budhanilkantha,0|deuba chowk,400|chapali bus stop,950|hattigauda,1800|golfutar,300|neuro hospital,750|gangalal hospital,550|narayan gopal chowk,950|teaching hospital,1100|rastrapati bhawan,650|kukl,800|lazimpat,950|jamal,1700|kantipath,900|rnac bus stop,900",
  "5|kharibot,0|banasthali,1300|balaju,750|sasa banquet,650|sorakhutte,280|thamel,280|lainchaur,400|jamal,1200|rnac bus stop,1800",
  "6|budhanilkantha,0|deuba chowk,400|chapali bus stop,950|hattigauda,1800|golfutar,300|neuro hospital,750|gangalal hospital,550|narayan gopal chowk,950|basundhara,450|basundhara police chauki,950|samakhushi,1200|gongabu,600|balaju,1300|banasthali,750|dhungedhara,400|swoyambhu,1400",
  "7|kalanki,0|solteemode,1200|kalimati,600|teku hospital,750|tripureswor-1,500|thapathali,1200|baneshwor chowk,150|shantinagar,450|tinkune,700|gairigaun,850|sinamangal,1200|airport gate,180",
  "8|panitanki,0|radha-krishna mandir,1100|dhungedhara,1200|banasthali,400|balaju,750|sasa banquet,650|sorakhutte,280|thamel,280|lainchaur,400|jamal,1200|rnac bus stop,1800",
];

/* Gets all the locations name from the routes_data above */
export const get_all_locations = (): string[] => {
  let locations: string[] = [];
  for (let row = 0; row < routes_data.length; row++) {
    let line = routes_data[row].split("|");
    line.shift();
    for (let i = 0; i < line!.length; i++) {
      const loc = line![i].split(",")[0];
      if (!locations.includes(loc[0].toUpperCase() + loc.slice(1))) {
        locations.push(loc[0].toUpperCase() + loc.slice(1));
      }
    }
  }
  return locations;
};
