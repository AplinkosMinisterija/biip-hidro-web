import { RolesTypes } from "./constants";
export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: RolesTypes;
  active?: boolean;
  phone?: string;
  mobilePhone?: string;
  password?: string;
  personalCode?: string;
  duties?: string;
  accessDate?: Date;
  getData?: boolean;
  error?: string;
  profiles?: Profile[];
}

export type FileProps = {
  url: string;
  name: string;
  size: number;
  main?: boolean;
};

export interface TenantUser {
  id?: string;

  role?: RolesTypes;
  tenant: Tenant;
  user: User;
}

export type ProfileId = "freelancer" | string;

export interface Profile {
  id: ProfileId;
  name: string;
  freelancer: boolean;
  code?: string;
  email?: string;
  role: RolesTypes;
  phone: string;
}

export interface Tenant {
  phone: string;
  code: string;
  email: string;
  id?: number | string;
  name: string;
}

export type ResponseFileProps = {
  url: string;
  filename: string;
  size: number;
};

export interface ListResultProps<T> {
  rows?: T[];
  totalPages?: number;
  error?: string;
}

export interface HydroPowerPlant {
  id?: string;
  hydrostaticId: string;
  name: string;
  apiId?: number;
  upperBasinMax: number;
  upperBasinMin: number;
  lowerBasinMin: number;
  power: string;
  events: Event[];
  geom: {
    coordinates: number[];
    type: string;
    violationCount: number;
    marker: any;
    name: string;
  };
}

export interface Event {
  id?: string;
  time: Date;
  hydroPowerPlant: any;
  upperBasin: number;
  lowerBasin: number;
}

export interface HydroPowerPlantTableProps {
  id?: string;
  name: string;
  upperBasinMax: number;
  upperBasinMin: number;
  lowerBasinMin: number;
  events: Event[];
  upperBasin: number;
  lowerBasin: number;
  today: number;
  week: number;
  month: number;
}

export interface Range {
  time: {
    $gte: string;
    $lt: string;
  };
}
