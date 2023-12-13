import { endOfDay, format, startOfDay } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { isEmpty } from "lodash";
import moment from "moment";
import { toast } from "react-toastify";
import styled from "styled-components";
import { ButtonColors } from "../components/buttons/Button";
import { DateFormats, TimeRanges } from "./constants";
import { validationTexts } from "./texts";
import { HydroPowerPlant, HydroPowerPlantTableProps } from "./types";

interface HandlePaginationProps {
  data: any[];
  page: string;
  pageSize: number;
}

export const handleAlert = (responseError?: string) => {
  toast.error(
    validationTexts[responseError as keyof typeof validationTexts] ||
      validationTexts.error,
    {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true
    }
  );
};

export const handleSuccess = (message: string) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true
  });
};

export const handlePagination = ({
  data,
  page = "1",
  pageSize
}: HandlePaginationProps) => {
  const start = (parseInt(page) - 1) * pageSize;
  const end = parseInt(page) * pageSize;
  const totalPages = Math.ceil(data.length / pageSize);
  const slicedData = data.slice(start, end);

  return { totalPages, slicedData };
};

export const isNew = (id?: string) => !id || id === "naujas";

export const formatDate = (date: Date | string) =>
  date ? format(new Date(date), "yyyy-MM-dd") : "-";

export const formatDateTo = (date: Date) => {
  return utcToZonedTime(endOfDay(new Date(date)), "Europe/Vilnius");
};

export const formatDateFrom = (date: Date) => {
  return utcToZonedTime(startOfDay(new Date(date)), "Europe/Vilnius");
};

export const timeRangeToQuery = {
  [TimeRanges.HOUR]: {
    time: {
      $gte: moment().startOf("day").format(),
      $lt: moment().endOf("day").format()
    }
  },
  [TimeRanges.OTHER_DAY]: {
    time: {
      $gte: moment().startOf("day").format(),
      $lt: moment().endOf("day").format()
    }
  },
  [TimeRanges.DAY]: {
    time: {
      $gte: moment().subtract(1, "week").startOf("day").format(),
      $lt: moment().endOf("day").format()
    }
  },
  [TimeRanges.WEEK]: {
    time: {
      $gte: moment().subtract(1, "month").startOf("day").format(),
      $lt: moment().endOf("day").format()
    }
  }
};

export const getCustomTimeRangeToQuery = (day: Date) => {
  return {
    time: {
      $gte: moment(day).startOf("day").format(),
      $lt: moment(day).endOf("day").format()
    }
  };
};

export const timeRangeOptions = Object.values(TimeRanges);

export const handleGetViolationCount = (hydro: HydroPowerPlant) => {
  if (!hydro) return 0;

  const { upperBasinMax, upperBasinMin, lowerBasinMin, events } = hydro;

  if (!upperBasinMax && !upperBasinMin && !lowerBasinMin) return 0;

  const violationCount = events.filter((event) => {
    const isViolated =
      (upperBasinMin &&
        upperBasinMax &&
        !inRange(event.upperBasin, upperBasinMin, upperBasinMax)) ||
      (lowerBasinMin && lt(event.lowerBasin, lowerBasinMin));

    return isViolated;
  }).length;

  return violationCount;
};

const renderTableUpperBasinField = (
  upperBasin: number,
  upperBasinMax: number,
  upperBasinMin: number
) => {
  const isViolated =
    upperBasin &&
    upperBasinMin &&
    upperBasinMax &&
    !inRange(upperBasin, upperBasinMin, upperBasinMax);

  if (isViolated) {
    return <BasinValue variant={ButtonColors.DANGER}>{upperBasin}</BasinValue>;
  }

  return upperBasin;
};

const renderTableLowerBasinField = (
  lowerBasin: number,
  lowerBasinMin: number
) => {
  if (lowerBasin && lowerBasinMin && lt(lowerBasin, lowerBasinMin)) {
    return <BasinValue variant={ButtonColors.DANGER}>{lowerBasin}</BasinValue>;
  }

  return lowerBasin;
};

export const mapEvents = (hydroPowerPlant: HydroPowerPlant) => {
  const { events, upperBasinMax, upperBasinMin, lowerBasinMin } =
    hydroPowerPlant;

  return events.map((event) => {
    return {
      upperBasin: renderTableUpperBasinField(
        event.upperBasin,
        upperBasinMax,
        upperBasinMin
      ),
      lowerBasin: renderTableLowerBasinField(event.lowerBasin, lowerBasinMin),
      time: moment(event.time).format(DateFormats.HOUR)
    };
  });
};

export const mapHydro = (hydroPowerPlants: HydroPowerPlantTableProps[]) => {
  return hydroPowerPlants.map((hydro) => {
    const {
      upperBasin,
      upperBasinMax,
      upperBasinMin,
      lowerBasin,
      lowerBasinMin,
      today,
      week,
      month
    } = hydro;

    return {
      id: hydro.id,
      name: hydro.name,
      upperBasin: renderTableUpperBasinField(
        upperBasin,
        upperBasinMax,
        upperBasinMin
      ),
      lowerBasin: renderTableLowerBasinField(lowerBasin, lowerBasinMin),
      today,
      week,
      month
    };
  });
};

export const inRange = (num: number, start: number, end: number) => {
  return num >= start && num <= end;
};

export const lt = (num: number, other: number) => {
  return num < other;
};

export const getTimeRangeLabel = (
  dateFrom: string,
  dateTo: string,
  format: DateFormats
) => `${moment(dateFrom).format(format)} - ${moment(dateTo).format(format)}`;

export const mapHydroPowerPlants = (list: HydroPowerPlant[]) =>
  list.map((item) => {
    return {
      ...item,
      ...(!isEmpty(item.events) && {
        events: item.events.filter((n) => {
          return (
            typeof n?.lowerBasin === "number" &&
            typeof n?.upperBasin === "number"
          );
        })
      }),
      name: handleTemporaryTextTransformation(item.name)
    };
  });

const handleTemporaryTextTransformation = (word: string) => {
  const newWord =
    word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase();

  return newWord.replace("he", "HE");
};

const BasinValue = styled.span<{
  variant?: ButtonColors;
}>`
  color: ${({ variant, theme }) => theme.colors[variant!]};
`;
