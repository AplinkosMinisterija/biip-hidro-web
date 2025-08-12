import { isEmpty } from "lodash";
import moment from "moment";
import { toast } from "react-toastify";
import styled from "styled-components";
import { ButtonColors } from "../components/buttons/Button";
import { DateFormats, TimeRanges } from "./constants";
import { validationTexts } from "./texts";
import { HydroPowerPlant, HydroPowerPlantTableProps } from "./types";

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

interface HandlePaginationProps {
  data: any[];
  page: string;
  pageSize: number;
}

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

export const inRange = (num: number, start: number, end: number) =>
  num >= start && num <= end;

export const lt = (num: number, other: number) => num < other;

export const getTimeRangeLabel = (
  dateFrom: string,
  dateTo: string,
  format: DateFormats
) => `${moment(dateFrom).format(format)} - ${moment(dateTo).format(format)}`;

const getDayRangeUTC = (day: moment.MomentInput = moment()) => ({
  $gte: moment.utc(day).startOf("day").format(),
  $lt: moment.utc(day).endOf("day").format()
});

export const timeRangeToQuery = {
  [TimeRanges.HOUR]: { time: getDayRangeUTC() },
  [TimeRanges.OTHER_DAY]: { time: getDayRangeUTC() },
  [TimeRanges.DAY]: { time: getDayRangeUTC(moment().subtract(1, "week")) },
  [TimeRanges.WEEK]: { time: getDayRangeUTC(moment().subtract(1, "month")) }
};

export const getCustomTimeRangeToQuery = (day: Date) => ({
  time: getDayRangeUTC(day)
});

export const timeRangeOptions = Object.values(TimeRanges);

const renderTableUpperBasinField = (
  upperBasin: number | undefined,
  upperBasinMax: number | undefined,
  upperBasinMin: number | undefined
) => {
  const isViolated =
    typeof upperBasin === "number" &&
    typeof upperBasinMin === "number" &&
    typeof upperBasinMax === "number" &&
    !inRange(upperBasin, upperBasinMin, upperBasinMax);

  if (isViolated) {
    return <BasinValue variant={ButtonColors.DANGER}>{upperBasin}</BasinValue>;
  }

  return upperBasin ?? "-";
};

const renderTableLowerBasinField = (
  lowerBasin: number | undefined,
  lowerBasinMin: number | undefined
) => {
  if (
    typeof lowerBasin === "number" &&
    typeof lowerBasinMin === "number" &&
    lt(lowerBasin, lowerBasinMin)
  ) {
    return <BasinValue variant={ButtonColors.DANGER}>{lowerBasin}</BasinValue>;
  }

  return lowerBasin ?? "-";
};

export const handleGetViolationCount = (hydro: HydroPowerPlant) => {
  if (!hydro) return 0;

  const { upperBasinMax, upperBasinMin, lowerBasinMin, events } = hydro;

  if (!upperBasinMax && !upperBasinMin && !lowerBasinMin) return 0;

  return events.filter(
    (event) =>
      (upperBasinMin &&
        upperBasinMax &&
        !inRange(event.upperBasin, upperBasinMin, upperBasinMax)) ||
      (lowerBasinMin && lt(event.lowerBasin, lowerBasinMin))
  ).length;
};

export const mapEvents = (hydroPowerPlant: HydroPowerPlant) => {
  const { events, upperBasinMax, upperBasinMin, lowerBasinMin } =
    hydroPowerPlant;

  return events.map((event) => ({
    upperBasin: renderTableUpperBasinField(
      event.upperBasin,
      upperBasinMax,
      upperBasinMin
    ),
    lowerBasin: renderTableLowerBasinField(event.lowerBasin, lowerBasinMin),
    time: moment.utc(event.time).format(DateFormats.HOUR)
  }));
};

export const mapHydro = (hydroPowerPlants: HydroPowerPlantTableProps[]) =>
  hydroPowerPlants.map((hydro) => {
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

export const mapHydroPowerPlants = (list: HydroPowerPlant[]) =>
  list.map((item) => ({
    ...item,
    ...(!isEmpty(item.events) && {
      events: item.events.filter(
        (n) =>
          typeof n?.lowerBasin === "number" && typeof n?.upperBasin === "number"
      )
    }),
    name: handleTemporaryTextTransformation(item.name)
  }));

const handleTemporaryTextTransformation = (word: string) => {
  const newWord =
    word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase();
  return newWord.replace("he", "HE");
};

const BasinValue = styled.span<{
  variant: ButtonColors;
}>`
  color: ${({ variant, theme }) => theme.colors[variant]};
`;
