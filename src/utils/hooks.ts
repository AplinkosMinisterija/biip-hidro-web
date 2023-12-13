import { isEqual } from "lodash";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import api from "./api";
import { handleAlert, mapHydroPowerPlants } from "./functions";
import { slugs } from "./routes";
import { Event, HydroPowerPlant, Range } from "./types";

export const useHydroPowerPlantsMap = (range: Range) => {
  const [current, setCurrent] = useState<HydroPowerPlant>();
  const { data = [], isLoading } = useQuery(
    ["hydroPowerPlantsMap", range],
    () => api.getHydroPowerPlantsMap({ query: range }),
    {
      onError: () => {
        handleAlert();
      },
      onSuccess(data) {
        if (current?.id) {
          setCurrent(data.find((hydro) => isEqual(hydro.id, current.id)));
        }
      }
    }
  );
  const hydroPowerPlants = mapHydroPowerPlants(data);

  return { hydroPowerPlants, current, setCurrent, isLoading };
};

export const useHydroPowerPlant = (id: string) => {
  const navigate = useNavigate();
  const { data, isFetching } = useQuery(
    ["hydroPowerPlant", id],
    () => api.getHydroPowerPlant(id),
    {
      onError: () => {
        navigate(slugs.hydroPowerPlantsMap);
      }
    }
  );

  return { isLoading: isFetching, hydroPowerPlant: data };
};

export const useEventsByHydroPowerPlantId = (id: string, range: Range) => {
  const query = JSON.stringify({
    hydroPowerPlant: id,
    ...range
  });

  const { data = [], isLoading } = useQuery(
    ["events", id, range],
    () => api.getEventsByHydroPowerPlantId({ query }),
    {
      onError: () => {
        handleAlert();
      }
    }
  );

  return {
    events: data.filter((n: Event) => {
      return (
        typeof n?.lowerBasin === "number" && typeof n?.upperBasin === "number"
      );
    }),
    eventsLoading: isLoading
  };
};

export const useHydroPowerPlantsTable = () => {
  const { data = [], isLoading } = useQuery(
    ["hydroPowerPlantsTable"],
    () => api.getHydroPowerPlantsTable(),
    {
      onError: () => {
        handleAlert();
      }
    }
  );

  const hydroPowerPlants = mapHydroPowerPlants(data);

  return { hydroPowerPlants, isLoading };
};
