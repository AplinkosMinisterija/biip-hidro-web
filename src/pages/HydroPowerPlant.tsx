import { isEmpty, isEqual } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import ButtonsGroup from "../components/buttons/ButtonsGroup";
import Datepicker from "../components/fields/DatePicker";
import DefaultLayout from "../components/Layouts/Default";
import { Graphs } from "../components/other/Graphs";
import Label from "../components/other/Label";
import LoaderComponent from "../components/other/LoaderComponent";
import TabBar, { Tab } from "../components/other/TabBar";
import Table, { TableData } from "../components/other/Table";
import ViolationCountMessage from "../components/other/ViolationCountMessage";
import { device } from "../styles";
import { DateFormats, TimeRanges } from "../utils/constants";
import {
  getCustomTimeRangeToQuery,
  handlePagination,
  handleViolationCount,
  mapEvents,
  timeRangeOptions,
  timeRangeToQuery
} from "../utils/functions";
import {
  useEventsByHydroPowerPlantId,
  useHydroPowerPlant
} from "../utils/hooks";
import {
  descriptions,
  eventLabels,
  formLabels,
  timeRangeLabels
} from "../utils/texts";
import { Range } from "../utils/types";

const HydroPowerPlantGraphs = () => {
  const tabs: Tab[] = [
    { value: "graph", label: "Grafikas" },
    { value: "table", label: "Lentelė" }
  ];
  const format = DateFormats.DAY;
  const [openCalendar, setOpenCalendar] = useState(false);

  const [timeFilter, setTimeFilter] = useState(TimeRanges.HOUR);
  const [customDate, setCustomDate] = useState<Range>(timeRangeToQuery.hour);

  const dateFrom = customDate.time.$gte;
  const dateTo = customDate.time.$lt;

  const timeRangeLabel = `${moment(dateFrom).format(format)} - ${moment(
    dateTo
  ).format(format)}`;

  const { id } = useParams();
  const [selectedTabValue, setSelectedTabValue] = useState(tabs[0].value);
  const { hydroPowerPlant, loading } = useHydroPowerPlant(id!);
  const { events, eventsLoading } = useEventsByHydroPowerPlantId(
    id!,
    customDate
  );
  const [searchParams] = useSearchParams();
  const { page } = Object.fromEntries([...Array.from(searchParams)]);

  const [tableData, setTableData] = useState<TableData>({ data: [] });

  const handleSetTableData = () => {
    if (!isEqual(selectedTabValue, "table")) return;

    const pageData = handlePagination({
      data: events,
      page: page,
      pageSize: 40
    });
    setTableData({
      data: mapEvents({ ...hydroPowerPlant!, events: pageData.slicedData }),
      totalPages: pageData.totalPages
    });
  };

  useEffect(() => {
    handleSetTableData();
  }, [page, loading, selectedTabValue, events]);

  const violationCount = handleViolationCount({ ...hydroPowerPlant!, events });

  const hasApi = !!hydroPowerPlant?.apiId;

  if (loading) return <LoaderComponent />;

  const renderValues = () => {
    if (!hasApi)
      return <NotReceivingData>{formLabels.notReceivingData}</NotReceivingData>;

    if (isEmpty(events))
      return <NotReceivingData>{formLabels.notFoundData}</NotReceivingData>;

    if (isEqual(selectedTabValue, "table"))
      return (
        <Table
          loading={loading}
          tableDataInfo={tableData}
          labels={eventLabels}
          isFilterApplied={false}
        />
      );

    return (
      <Graphs
        timeFilter={timeFilter}
        current={{ ...hydroPowerPlant!, events }}
      />
    );
  };

  const handleSetDateRange = (option: TimeRanges) => {
    setTimeFilter(option);
    if (isEqual(option, TimeRanges.OTHER_DAY)) {
      return setOpenCalendar(true);
    }
    setCustomDate(timeRangeToQuery[option]);
  };

  const renderContent = () => {
    if (eventsLoading) return <LoaderComponent />;

    return (
      <Container>
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
            value={customDate.time.$gte}
            open={openCalendar}
            onChange={(date) => setCustomDate(getCustomTimeRangeToQuery(date!))}
          />
        </ButtonContainer>
        <Label label={timeRangeLabel} />
        <ViolationCountMessage count={violationCount} />
        {renderValues()}
      </Container>
    );
  };

  return (
    <DefaultLayout>
      <Header>
        <HeaderContainer>
          <Name>
            {hydroPowerPlant?.name} <KW>({hydroPowerPlant?.power}kw)</KW>
          </Name>
          <HeaderInfo>
            <HeaderInfoItem>
              <HeaderInfoValue>
                {hydroPowerPlant?.upperBasinMin || "-"}
              </HeaderInfoValue>
              <HeaderInfoText>{descriptions.upperBasinMin}</HeaderInfoText>
            </HeaderInfoItem>
            <HeaderInfoItem>
              <HeaderInfoValue>
                {hydroPowerPlant?.upperBasinMax || "-"}
              </HeaderInfoValue>
              <HeaderInfoText>{descriptions.basinMax}</HeaderInfoText>
            </HeaderInfoItem>
            <HeaderInfoItem>
              <HeaderInfoValue>
                {hydroPowerPlant?.lowerBasinMin || "-"}
              </HeaderInfoValue>
              <HeaderInfoText>{descriptions.lowerBasinMin}</HeaderInfoText>
            </HeaderInfoItem>
          </HeaderInfo>
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

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 1200px;
  max-height: 100%;
  margin: auto;
  padding-top: 20px;

  @media ${device.mobileL} {
    padding: 20px 20px 0 20px;
  }
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
  margin-bottom: 30px;
`;

const HeaderInfo = styled.div`
  background-color: #0862ab;
  padding: 24px 40px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  @media ${device.mobileL} {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 24px 20px;
  }
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: auto;
`;
const HeaderInfoValue = styled.div`
  font-size: 3.2rem;
  font-weight: bold;
  color: #ffffff;
`;

const HeaderInfoItem = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  @media ${device.mobileL} {
    grid-template-columns: 100px 1fr;
    align-items: center;
  }
`;

const HeaderInfoText = styled.div`
  font-size: 1.4rem;
  color: #ffffff;
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
