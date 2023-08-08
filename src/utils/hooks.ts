import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "./api";
import { handleResponse } from "./functions";
import { slugs } from "./routes";
import { Event, HydroPowerPlant, Range } from "./types";

export const useCurrentLocation = () => {
  const [location, setLocation] = useState({});

  useEffect(() => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        const { latitude, longitude } = location.coords;
        setLocation({ x: latitude, y: longitude });
      });
    }
  }, []);
  return location;
};

export const useHydroPowerPlantsMap = (range: Range) => {
  const [hydroPowerPlants, setHydros] = useState<HydroPowerPlant[]>([]);
  const [current, setCurrent] = useState<HydroPowerPlant>();
  const getHydros = async () => {
    handleResponse({
      endpoint: () => api.getHydroPowerPlantsMap({ query: range }),
      onSuccess: (list: HydroPowerPlant[]) => {
        setHydros(
          list.map((item) => {
            return {
              ...item,
              name: handleTemporaryTextTransformation(item.name)
            };
          })
        );

        if (current?.id) {
          setCurrent(list.find((hydro) => isEqual(hydro.id, current.id)));
        }
      }
    });
  };

  useEffect(() => {
    getHydros();
  }, [range]);

  return { hydroPowerPlants, current, setCurrent };
};

export const useHydroPowerPlant = (id: string) => {
  const [loading, setLoading] = useState(true);
  const [hydroPowerPlant, setHydros] = useState<HydroPowerPlant>();
  const navigate = useNavigate();
  const getHydros = async () => {
    handleResponse({
      endpoint: () => api.getHydroPowerPlant(id!),
      onError: () => {
        navigate(slugs.hydroPowerPlantsMap);
      },
      onSuccess: (item: HydroPowerPlant) => {
        setHydros(item);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getHydros();
  }, [id]);

  return { loading, hydroPowerPlant };
};

export const useEventsByHydroPowerPlantId = (id: string, range: Range) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  console.log(range, "range");
  const getHydros = async () => {
    setLoading(true);
    handleResponse({
      endpoint: () =>
        api.getEventsByHydroPowerPlantId({
          id,
          query: JSON.stringify({
            hydroPowerPlant: id,
            ...range
          })
        }),
      onSuccess: (list: Event[]) => {
        setEvents(list);

        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getHydros();
  }, [range]);

  return { events, eventsLoading: loading };
};

export const useHydroPowerPlantsTable = () => {
  const [loading, setLoading] = useState(true);
  const [hydroPowerPlants, setHydros] = useState<HydroPowerPlant[]>([]);
  const getHydros = async () => {
    handleResponse({
      endpoint: () => api.getHydroPowerPlantsTable(),
      onSuccess: (list: HydroPowerPlant[]) => {
        setHydros(
          list.map((item) => {
            return {
              ...item,
              name: handleTemporaryTextTransformation(item.name)
            };
          })
        );
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getHydros();
  }, []);

  return { hydroPowerPlants, loading };
};

const handleTemporaryTextTransformation = (word: string) => {
  const newWord =
    word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase();

  return newWord.replace("he", "HE");
};
