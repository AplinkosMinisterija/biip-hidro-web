import { isEqual } from "lodash";
import React, { useState } from "react";
import styled from "styled-components";
import { TimeRanges } from "../../utils/constants";
import {
  getCustomTimeRangeToQuery,
  timeRangeOptions,
  timeRangeToQuery
} from "../../utils/functions";
import { timeRangeLabels } from "../../utils/texts";
import { Range } from "../../utils/types";
import ButtonsGroup from "../buttons/ButtonsGroup";
import Datepicker from "../fields/DatePicker";
export interface LabelProps {
  label: string;
}

const ButtonFilter = ({
  timeFilter,
  dateFilter,
  onSetTimeFilter,
  onSetDateFilter
}: {
  timeFilter: TimeRanges;
  dateFilter: Range;
  onSetDateFilter: React.Dispatch<React.SetStateAction<Range>>;
  onSetTimeFilter: React.Dispatch<React.SetStateAction<TimeRanges>>;
}) => {
  const [openCalendar, setOpenCalendar] = useState(false);

  const handleSetDateRange = (option: TimeRanges) => {
    onSetTimeFilter(option);

    if (isEqual(option, TimeRanges.OTHER_DAY)) {
      return setOpenCalendar(true);
    }
    onSetDateFilter(timeRangeToQuery[option]);
  };

  return (
    <ButtonContainer>
      <ButtonsGroup
        options={timeRangeOptions}
        getOptionLabel={(option: TimeRanges) => timeRangeLabels[option]}
        onChange={(option) => {
          handleSetDateRange(option);
        }}
        isSelected={(option) => isEqual(timeFilter, option)}
      />
      <Datepicker
        onClose={() => {
          setOpenCalendar(false);
        }}
        value={dateFilter.time.$gte}
        open={openCalendar}
        onChange={(date) => onSetDateFilter(getCustomTimeRangeToQuery(date!))}
      />
    </ButtonContainer>
  );
};

export default ButtonFilter;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
`;
