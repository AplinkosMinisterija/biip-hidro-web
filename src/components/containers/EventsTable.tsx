import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { handlePagination, mapEvents } from "../../utils/functions";
import { eventLabels } from "../../utils/texts";
import { Event, HydroPowerPlant } from "../../utils/types";
import Table, { TableData } from "../other/Table";

const EventTable = ({
  events,
  hydroPowerPlant,
  loading
}: {
  events: Event[];
  hydroPowerPlant: HydroPowerPlant;
  loading: boolean;
}) => {
  const [tableData, setTableData] = useState<TableData>({ data: [] });
  const [searchParams] = useSearchParams();
  const { page } = Object.fromEntries([...Array.from(searchParams)]);

  useEffect(() => {
    const pageData = handlePagination({
      data: events,
      page: page,
      pageSize: 40
    });
    setTableData({
      data: mapEvents({ ...hydroPowerPlant!, events: pageData.slicedData }),
      totalPages: pageData.totalPages
    });
  }, [page, loading, events, hydroPowerPlant]);

  return (
    <Table
      loading={loading}
      tableDataInfo={tableData}
      labels={eventLabels}
      isFilterApplied={false}
    />
  );
};

export default EventTable;
