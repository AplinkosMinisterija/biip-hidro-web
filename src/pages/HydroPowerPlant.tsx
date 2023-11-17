import { isEmpty, isEqual } from "lodash";
import { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import EventTable from "../components/containers/EventsTable";
import DefaultLayout from "../components/Layouts/Default";
import ButtonFilter from "../components/other/ButtonFilter";
import { Graphs } from "../components/other/Graphs";
import HeaderInfo from "../components/other/HeaderInfo";
import Label from "../components/other/Label";
import LoaderComponent from "../components/other/LoaderComponent";
import TabBar, { Tab } from "../components/other/TabBar";
import ViolationCountMessage from "../components/other/ViolationCountMessage";
import { device } from "../styles";
import { DateFormats, TimeRanges } from "../utils/constants";
import {
  getTimeRangeLabel,
  handleGetViolationCount,
  timeRangeToQuery
} from "../utils/functions";
import {
  useEventsByHydroPowerPlantId,
  useHydroPowerPlant
} from "../utils/hooks";
import { formLabels } from "../utils/texts";
import { Range } from "../utils/types";

enum TableValues {
  GRAPH = "GRAPH",
  TABLE = "TABLE"
}

const tabs: Tab[] = [
  { value: TableValues.GRAPH, label: "Grafikas" },
  { value: TableValues.TABLE, label: "Lentelė" }
];

const HydroPowerPlantGraphs = () => {
  const { id } = useParams();
  const format = DateFormats.DAY;
  const [timeFilter, setTimeFilter] = useState(TimeRanges.HOUR);
  const [dateFilter, setDateFilter] = useState<Range>(timeRangeToQuery.hour);
  const dateFrom = dateFilter.time.$gte;
  const dateTo = dateFilter.time.$lt;
  const timeRangeLabel = getTimeRangeLabel(dateFrom, dateTo, format);
  const [selectedTabValue, setSelectedTabValue] = useState(tabs[0].value);
  const { hydroPowerPlant, isLoading } = useHydroPowerPlant(id!);
  const { events, eventsLoading } = useEventsByHydroPowerPlantId(
    id!,
    dateFilter
  );

  const fullHydroPowerPlant = {
    ...hydroPowerPlant!,
    events
  };

  const violationCount = handleGetViolationCount(fullHydroPowerPlant);

  const renderValues = () => {
    if (eventsLoading || isLoading || !hydroPowerPlant)
      return <LoaderComponent />;

    if (isEmpty(events))
      return <NotReceivingData>{formLabels.notFoundData}</NotReceivingData>;

    if (isEqual(selectedTabValue, TableValues.TABLE))
      return (
        <EventTable
          loading={eventsLoading}
          hydroPowerPlant={hydroPowerPlant}
          events={events}
        />
      );
    if (timeFilter && fullHydroPowerPlant)
      return <Graphs timeFilter={timeFilter} current={fullHydroPowerPlant} />;

    return <></>;
  };

  const renderContent = () => {
    return (
      <Container>
        <InnerContainer>
          <ButtonFilter
            timeFilter={timeFilter}
            dateFilter={dateFilter!}
            onSetTimeFilter={setTimeFilter}
            onSetDateFilter={setDateFilter}
          />
          <Label label={timeRangeLabel} />
          <ViolationCountMessage count={violationCount} />
          {renderValues()}
        </InnerContainer>
      </Container>
    );
  };

  if (isLoading) return <LoaderComponent />;

  return (
    <DefaultLayout>
      <Header>
        <HeaderContainer>
          <Name>
            {hydroPowerPlant?.name} <KW>({hydroPowerPlant?.power}kw)</KW>
          </Name>
          <HeaderInfo hydroPowerPlant={hydroPowerPlant!} />
          <TabBar
            tabs={tabs}
            activeTab={selectedTabValue}
            onClick={(tab) => setSelectedTabValue(tab.value)}
          />
        </HeaderContainer>
      </Header>
      {renderContent()}
    </DefaultLayout>
  );
};

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 1200px;
  max-height: 100%;
  margin: auto;
`;

const Name = styled.div`
  font-weight: bold;
  font-size: 4.8rem;
  color: #0862ab;
  opacity: 1;
  margin-bottom: 12px;
  @media ${device.mobileL} {
    font-size: 2.8rem;
  }
`;

const KW = styled.span`
  font-size: 2.8rem;
  @media ${device.mobileL} {
    font-size: 1.6rem;
  }
`;

const Header = styled.div`
  background-color: #ecf6ff;
  padding: 20px 20px 0px 20px;
`;

const Container = styled.div`
  padding: 20px;
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: auto;
`;

const NotReceivingData = styled.div`
  font-size: 1.9rem;
  color: #111827;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default HydroPowerPlantGraphs;
