export enum RolesTypes {
  USER = "USER",
  USER_ADMIN = "USER_ADMIN",
  OWNER = "OWNER"
}

export enum ServerErrors {
  USER_NOT_FOUND = `Email not found.`,
  WRONG_PASSWORD = "Wrong password.",
  USER_EXIST = "User already exists.",
  WRONG_OLD_PASSWORD = "Wrong old password.",
  PARAMETERS_VALIDATION_ERROR = "Parameters validation error!",
  NOT_FOUND = "Not found.",
  ENTITY_NOT_FOUND = "Entity not found"
}
export enum Resources {
  HYDRO_POWER_PLANTS = "hydroPowerPlants/uetk",
  HYDRO_POWER_PLANTS_MAP = "hydroPowerPlants/map",
  HYDRO_POWER_PLANTS_TABLE = "hydroPowerPlants/table",
  EVENTS = "events"
}

export enum SortFields {
  TIME = "time",
  Name = "name"
}

export enum TagColors {
  BLUE = "blue",
  BROWN = "brown",
  GREEN = "green",
  PINK = "pink",
  VIOLET = "violet",
  ORANGE = "orange",
  SKYBLUE = "skyblue",
  GREY = "grey"
}

export enum TimeRanges {
  HOUR = "hour",
  DAY = "day",
  WEEK = "week",
  OTHER_DAY = "other"
}

export enum DateFormats {
  HOUR = "YYYY-MM-DD HH:mm",
  DAY = "YYYY-MM-DD"
}
