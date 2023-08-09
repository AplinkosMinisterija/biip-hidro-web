import Axios, { AxiosInstance, AxiosResponse } from "axios";
import { Resources, SortFields } from "./constants";
import { HydroPowerPlant } from "./types";

interface GetAll {
  resource: string;
  page?: number;
  populate?: string[];
  municipalityId?: string;
  filter?: string | any;
  query?: string;
  pageSize?: string;
  search?: string;
  searchFields?: string[];
  sort?: string[];
  scope?: string;
  fields?: string[];
  id?: string;
  geom?: any;
  responseType?: any;
}

export interface GetAllResponse<T> {
  rows: T[];
  totalPages: number;
  page: number;
  pageSize: number;
  error?: any;
}

interface TableList<T = any> {
  filter?: T;
  page?: number;
  id?: string;
  pageSize?: string;
  isMy?: boolean;
  scope?: string;
  geom?: any;
  fields?: string[];
  resource?: Resources;
  search?: string;
  query?: any;
}

interface GetOne {
  resource: string;
  id?: string | any;
  populate?: string[];
  scope?: string;
}
interface UpdateOne {
  resource?: string;
  id?: string;
  params?: any;
}

interface Delete {
  resource: string;
  id: string;
}

interface Create {
  resource: string;
  params: any;
  id?: string;
}

class Api {
  private readonly proxy: string = "/api";

  private AuthApiAxios: AxiosInstance;

  constructor() {
    this.AuthApiAxios = Axios.create();

    this.AuthApiAxios.interceptors.request.use(
      (config) => {
        config.url = this.proxy + config.url;
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );
  }

  errorWrapper = async (endpoint: () => Promise<AxiosResponse<any, any>>) => {
    const { data } = await endpoint();

    return data;
  };

  get = async ({
    resource,
    page,
    filter,
    pageSize,
    search,
    query,
    id,
    responseType
  }: GetAll) => {
    const config = {
      params: {
        pageSize: pageSize || 10,
        page: page || 1,
        ...(!!search && { search }),
        ...(!!filter && { filter }),
        ...(!!query && { query })
      },
      ...(!!responseType && { responseType })
    };

    return this.errorWrapper(() =>
      this.AuthApiAxios.get(`/${resource}${id ? `/${id}` : ""}`, config)
    );
  };

  getAll = async ({ resource, populate, filter, query, id, sort }: GetAll) => {
    const config = {
      params: {
        ...(!!populate && { populate }),
        ...(!!sort && { sort }),
        ...(!!filter && { filter }),
        ...(!!query && { query })
      }
    };

    return this.errorWrapper(() =>
      this.AuthApiAxios.get(`/${resource}${id ? `/${id}` : ""}/all`, config)
    );
  };

  getOne = async ({ resource, id, populate, scope }: GetOne) => {
    const config = {
      params: {
        ...(!!populate && { populate }),
        ...(!!scope && { scope })
      }
    };

    return this.errorWrapper(() =>
      this.AuthApiAxios.get(`/${resource}${id ? `/${id}` : ""}`, config)
    );
  };

  update = async ({ resource, id, params }: UpdateOne) => {
    return this.errorWrapper(() =>
      this.AuthApiAxios.patch(`/${resource}/${id}`, params)
    );
  };

  delete = async ({ resource, id }: Delete) => {
    return this.errorWrapper(() =>
      this.AuthApiAxios.delete(`/${resource}/${id}`)
    );
  };
  create = async ({ resource, id, params }: Create) => {
    return this.errorWrapper(() =>
      this.AuthApiAxios.post(`/${resource}${id ? `/${id}` : ""}`, params)
    );
  };

  getHydroPowerPlantsMap = async ({ query }: any): Promise<HydroPowerPlant[]> =>
    await this.get({
      resource: Resources.HYDRO_POWER_PLANTS_MAP,
      query
    });

  getHydroPowerPlantsTable = async (): Promise<HydroPowerPlant[]> =>
    await this.get({
      resource: Resources.HYDRO_POWER_PLANTS_TABLE
    });

  getHydroPowerPlant = async (id: string): Promise<HydroPowerPlant> =>
    await this.getOne({
      resource: Resources.HYDRO_POWER_PLANTS,
      id
    });

  getEventsByHydroPowerPlantId = async ({ filter, page, query }: TableList) =>
    await this.getAll({
      resource: Resources.EVENTS,
      filter,
      page,
      sort: [SortFields.TIME],
      query
    });
}
const api = new Api();

export default api;
