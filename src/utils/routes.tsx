import HydroPowerPlantGraphs from "../pages/HydroPowerPlant";
import HydroPowerPlantsMap from "../pages/HydroPowerPlantsMap";
import HydroPowerPlantsTable from "../pages/HydroPowerPlantsTable";
import { menuLabels } from "./texts";

export const slugs = {
  hydroPowerPlantsMap: `/hidro-elektrines/zemelapis`,
  hydroPowerPlant: (id: string) => `/hidro-elektrines/${id}`,
  hydroPowerPlantsTable: `/hidro-elektrines/lentele`
};

enum Ids {
  ID = ":id"
}

export const routes = [
  {
    name: menuLabels.map,
    slug: slugs.hydroPowerPlantsMap,
    component: <HydroPowerPlantsMap />,
    menu: true
  },
  {
    name: menuLabels.table,
    slug: slugs.hydroPowerPlantsTable,
    component: <HydroPowerPlantsTable />,
    menu: true
  },
  {
    slug: slugs.hydroPowerPlant(Ids.ID),
    component: <HydroPowerPlantGraphs />
  }
];

export const menuRoutes = routes.filter((route) => route?.menu);
