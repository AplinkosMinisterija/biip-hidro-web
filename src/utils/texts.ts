import { ServerErrors, TimeRanges } from "./constants";

export const validationTexts: any = {
  formFillError: "Neteisingai užpildyta forma",
  requireMap: "Privalote pasirinkti vietą žemėlapyje",
  requirePhotos: "Privalote įkelti nuotrauką",
  userDeniedLocation: "Turite leisti nustatyti jūsų buvimo vietą",
  requireSpeciesType: "Privalote pasirinkti bent vieną rūšių tipą",
  requireText: "Privalomas laukelis",
  requireSelect: "Privalote pasirinkti",
  badEmailFormat: "Blogas el. pašto adresas",
  badPhoneFormat: "Blogai įvestas telefono numeris",
  tooFrequentRequest: "Nepavyko, per dažna užklausa prašome pabandyti veliau ",
  passwordsDoNotMatch: "Slaptažodžiai nesutampa",
  error: "Įvyko nenumatyta klaida, prašome pabandyti vėliau",
  validFirstName: "Įveskite taisyklingą vardą",
  validLastName: "Įveskite taisyklingą pavardę",
  [ServerErrors.WRONG_PASSWORD]: "Blogas elektroninis paštas arba slaptažodis",
  [ServerErrors.USER_NOT_FOUND]: "Naudotojo su tokiu el. paštu nėra",
  badFileTypes: "Blogi failų tipai",
  fileSizesExceeded: "Viršyti failų dydžiai",
  personalCode: "Neteisingas asmens kodo formatas",
  positiveNumber: "Reikšmė turi būti didesnė už nulį",
  requireFiles: "Privalote įkelti dokumentus",
  atLeastOneColumn: "Turi būti pasirinktas bent vienas stulpelis"
};

export const inputLabels = {
  selectFromMap: "pasirinkti iš žemėlapio",
  currentLocation: "dabartinė vieta",
  chooseOption: "Pasirinkite",
  personalCode: "Asmens kodas",
  uploadPhotos: "Įkelti nuotraukas",
  phone: "Telefono numeris",
  lastName: "Pavardė",
  firstName: "Vardas",
  email: "Elektroninis paštas",
  noOptions: "Nėra pasirinkimų",
  location: "Žuvinimo vieta",
  search: "Paieška"
};

export const buttonLabels = {
  forgotPassword: "Pamiršau slaptažodį",
  login: "Prisijungti",
  or: "arba",
  eLogin: "Prisijungti per el. valdžios vartus"
};

export const formLabels = {
  upperBasin: "Aukštutiniame bjefe vandens lygis, m",
  lowerBasin: "Žemutiniame bjefe vandens lygis, m",
  shortLowerBasin: "Žemutiniame bjefe, m",
  shortUpperBasin: "Aukštutiniame bjefe, m",
  waterLevel: "Vandens lygis",
  notReceivingData: "Matavimų duomenys neteikiami apie šią elektrinę",
  notFoundData: "Neturime šios dienos duomenų apie šią elektrinę",
  hydroPowerPlant: "Hidroelektrinės"
};

export const buttonsTitles = {
  select: "Pasirinkti",
  view: "Peržiūrėti",
  moreDetail: "Detaliau",
  delete: "Ištrinti",
  clear: "Išvalyti"
};

export const toasts = {};

export const timeRangeLabels = {
  [TimeRanges.HOUR]: "Šiandienos",
  [TimeRanges.DAY]: "Savaitės",
  [TimeRanges.WEEK]: "Mėnesio",
  [TimeRanges.OTHER_DAY]: "Pasirinkite"
};

export const descriptions = {
  tableNotFound: "Atsiprašome nieko neradome pagal pasirinktus filtrus",
  upperBasinMin: "Leistinas žemiausias vandens lygis tvenkinyje (ŽVL)",
  basinMax: "Leistinas vandens lygis tvenkinyje",
  lowerBasinMin:
    "Leistinas žemiausias vandens lygis tvenkinio žemutiniame bjefe",
  waterLevel: "Matavimų duomenys"
};

export const hydroPowerPlantsLabels = {
  name: "Hidroelektrinė",
  upperBasin: "Aukštutiniame bjefe, m",
  lowerBasin: "Žemutiniame bjefe, m",
  today: "Dienos pažeidimų sk.",
  week: "Savaitės pažeidimų sk.",
  month: "Mėnesio pažeidimo sk."
};

export const eventLabels = {
  time: "Data",
  upperBasin: "Aukštutiniame bjefe, m",
  lowerBasin: "Žemutiniame bjefe, m"
};

export const menuLabels = {
  map: "Žemėlapis",
  table: "Lentelė"
};
