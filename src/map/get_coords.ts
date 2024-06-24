export const get_coords = (location: string): number[] => {
  let table = new Map<string, number[]>();

  let coords = [
    "bafal,27.702954,85.282020",
    "syuchatar,27.699607,85.281567",
    "kalanki,27.693446,85.281979",
    "solteemode,27.696659,85.293725",
    "kalimati,27.698388,85.299315",
    "teku hospital,27.696475,85.306386",
    "tripureswor-1,27.694803,85.310932",
    "rnac bus stop,27.702387,85.313526",
    "jamal,27.708926,85.315561",
    "sitapaila,27.707724,85.282602",
    "swoyambhu,27.715764,85.283608",
    "sadtobato bus stop,27.659228,85.325367",
    "b and b,27.664341,85.330151",
    "gwarko,27.666808,85.332164",
    "balkumari,27.671601,85.340271",
    "koteswor bus stop,27.679872,85.349463",
    "sinamangal bus stop,27.695357,85.354960",
    "gaushala,27.707433,85.343895",
    "baageswori,27.710527,85.344179",
    "mitrapark,27.713274,85.345362",
    "chabahil,27.717266,85.346570",
    "chappal karkhana,27.734631,85.342362",
    "basundhara,27.742070,85.332348",
    "balaju,27.727216,85.304767",
    "banasthali,27.724903,85.298046",
    "khasi bazar,27.689233,85.284194",
    "balkhu,27.684774,85.298384",
    "ekantakuna,27.666730,85.308266",
    "kusunti,27.665264,85.313066",
    "thasikhel,27.662836,85.316474",
    "bagbazar,27.705902,85.317219",
    "purano bus park,27.704266,85.316425",
    "kantipath,27.709321,85.314584",
    "lazimpat,27.721003,85.319767",
    "maharajgunj,27.734039,85.330186",
    "us embassy,27.738216,85.335252",
    "teaching hospital,27.735647,85.332108",
    "naagdhunga,27.701048,85.205717",
    "thankot,27.689132,85.226750",
    "gurjedhara,27.687727,85.241949",
    "raniban bus station,27.735921,85.282102",
    "radha-krishna mandir,27.730011,85.287453",
    "sasa banquet,27.721626,85.308012",
    "sorakhutte,27.719149,85.309658",
    "thamel,27.71824,85.311632",
    "lainchaur,27.717348,85.314894",
    "rastrapati bhawan,27.732493,85.32816",
    "gangalal hospital,27.74572,85.342364",
    "panitanki,27.736925,85.285699",
    "kharibot,27.730812,85.29393",
    "gongabu,27.735057,85.309076",
    "samakhushi,27.735123,85.318129",
    "machha pokhari,27.735227,85.305952",
    "dhungedhara,27.725017,85.288985",
    "budhanilkantha,27.775898,85.361589",
    "deuba chowk,27.774933,85.361020",
    "chapali bus stop,27.767679,85.355774",
    "hattigauda,27.756263,85.348998",
    "golfutar,27.750912,85.345658",
    "neuro hospital,27.748737,85.345450",
    "narayan gopal chowk,27.740070,85.337082",
    "kukl,27.728880,85.324966",
    "basundhara police chauki,27.738273,85.325414",
    "thapathali,27.694006,85.319236",
    "baneshwor chowk,27.688598,85.334593",
    "shantinagar,27.686711,85.343047",
    "tinkune,27.686151,85.345632",
    "gairigaun,27.689501,85.351777",
    "sinamangal,27.695393,85.354978",
  ];

  for (let i = 0; i < coords.length; i++) {
    let loc = coords[i].split(",");
    let lat = parseFloat(loc[1]);
    let long = parseFloat(loc[2]);
    table.set(loc[0], [lat, long]);
  }
  let c = table.get(location.toLowerCase());
  return c!;
};