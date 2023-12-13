import { isEmpty } from "lodash";

import React from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { device } from "../../styles";
import { DateFormats, TimeRanges } from "../../utils/constants";
import { getTimeRangeLabel, inRange, lt } from "../../utils/functions";
import { slugs } from "../../utils/routes";
import { buttonsTitles, formLabels } from "../../utils/texts";
import { HydroPowerPlant, Range } from "../../utils/types";
import Button, { ButtonColors } from "../buttons/Button";
import { Graphs } from "./Graphs";
import Icon from "./Icon";
import Label from "./Label";
import ViolationCountMessage from "./ViolationCountMessage";

interface PopUpProps {
  onClose?: () => void;
  children?: React.ReactNode;
  current: HydroPowerPlant;
  timeFilter: TimeRanges;
  customDate: Range;
}

const HydroPopUp = ({
  children,
  timeFilter,
  customDate,
  onClose,
  current
}: PopUpProps) => {
  const { upperBasinMax, upperBasinMin, events, lowerBasinMin } = current;

  const navigate = useNavigate();
  const format = DateFormats.DAY;
  const dateFrom = customDate.time.$gte;
  const dateTo = customDate.time.$lt;
  const timeRangeLabel = getTimeRangeLabel(dateFrom, dateTo, format);
  let violationCount = current?.geom?.violationCount || 0;

  const renderUpperBasinValue = () => {
    const lastEvent = events?.[events?.length - 1]?.upperBasin;
    if (upperBasinMin && upperBasinMax) {
      const orLastEventViolated = !inRange(
        lastEvent,
        upperBasinMin,
        upperBasinMax
      );

      if (orLastEventViolated) {
        return (
          <BasinValue variant={ButtonColors.DANGER}>{lastEvent}</BasinValue>
        );
      }

      const hasSomeViolation = events.filter(
        (event) => !inRange(event.upperBasin, upperBasinMin, upperBasinMax)
      ).length;

      if (hasSomeViolation) {
        return (
          <BasinValue>
            {lastEvent}
            <BasinValue variant={ButtonColors.DANGER}> !</BasinValue>
          </BasinValue>
        );
      }
    }

    return <BasinValue>{lastEvent} </BasinValue>;
  };

  const renderLowerBasinValue = () => {
    const lastEvent = events?.[events?.length - 1]?.lowerBasin;
    if (lowerBasinMin) {
      const orLastEventViolated = lt(lastEvent, lowerBasinMin);

      if (orLastEventViolated) {
        return (
          <BasinValue variant={ButtonColors.DANGER}>{lastEvent}</BasinValue>
        );
      }

      const hasSomeViolation = events.filter((event) =>
        lt(event.lowerBasin, lowerBasinMin)
      ).length;

      if (hasSomeViolation) {
        return (
          <BasinValue>
            {lastEvent}
            <BasinValue variant={ButtonColors.DANGER}> !</BasinValue>
          </BasinValue>
        );
      }
    }

    return <BasinValue>{lastEvent}</BasinValue>;
  };

  const renderContent = () => {
    if (isEmpty(events))
      return <BasinText>{formLabels.notReceivingData}</BasinText>;

    return (
      <>
        <ViolationCountMessage count={violationCount} />
        <Label label={formLabels.waterLevel} />
        <BasinLine>
          <BasinInnerLine>
            <Basin src="/lowerBasin.svg" />
            <BasinText>{formLabels.shortUpperBasin}</BasinText>
          </BasinInnerLine>
          {renderUpperBasinValue()}
        </BasinLine>
        <BasinLine>
          <BasinInnerLine>
            <Basin src="/upperBasin.svg" />
            <BasinText>{formLabels.shortLowerBasin}</BasinText>
          </BasinInnerLine>
          {renderLowerBasinValue()}
        </BasinLine>
        <Graphs timeFilter={timeFilter} current={current} />
        <Button onClick={() => navigate(slugs.hydroPowerPlant(current?.id!))}>
          {buttonsTitles.moreDetail}
        </Button>{" "}
      </>
    );
  };

  return (
    <Container>
      <IconContainer onClick={onClose}>
        <StyledIcon name="close" />
      </IconContainer>

      <InnerContainer>
        <Name>{current?.name}</Name>
        <Label label={timeRangeLabel} />
        {renderContent()}
      </InnerContainer>

      {children}
    </Container>
  );
};

const Container = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 470px;
  max-height: 95%;

  top: 10px;
  right: 20px;
  position: absolute;
  overflow-y: auto;
  z-index: 10;
  @media ${device.mobileL} {
    border-radius: 0px;
    width: 100%;
    height: 100%;
    top: 0px;
    right: 0px;
  }
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  font-size: 2rem;
`;

const IconContainer = styled.div`
  margin: 0 0 0 auto;
  width: fit-content;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BasinLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BasinInnerLine = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Basin = styled.img`
  width: 40px;
  height: 40px;
  background-color: #ecf6ff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BasinText = styled.div`
  font-size: 1.4rem;
  color: #111827;
  opacity: 0.72;
`;

const BasinValue = styled.span<{
  variant?: ButtonColors;
}>`
  text-align: left;
  font-size: 1.8rem;
  color: ${({ variant, theme }) => theme.colors[variant!] || "#040f2c"};
  font-weight: bold;
`;

const Name = styled.div`
  font-size: 2rem;
  color: #030303;
  font-weight: bold;
`;

export default HydroPopUp;
