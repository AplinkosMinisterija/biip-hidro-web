import { useEffect, useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams
} from "react-router-dom";
import styled from "styled-components";
import TextField from "../components/fields/TextField";
import { getFilteredOptions } from "../components/fields/utils/functions";
import DefaultLayout from "../components/Layouts/Default";
import Table, { TableData } from "../components/other/Table";
import { handlePagination, mapHydro } from "../utils/functions";
import { useHydroPowerPlantsTable } from "../utils/hooks";
import { slugs } from "../utils/routes";
import { hydroPowerPlantsLabels } from "../utils/texts";

const HydroPowerPlantsTable = () => {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [initLoading, setInitLoading] = useState(true);
  const { page } = Object.fromEntries([...Array.from(searchParams)]);
  const [tableData, setTableData] = useState<TableData>({ data: [] });
  const { hydroPowerPlants, isLoading } = useHydroPowerPlantsTable();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    const pageData = handlePagination({
      data: getFilteredOptions(hydroPowerPlants, name, (option) => option.name),
      page: page,
      pageSize: 40
    });
    setTableData({
      data: mapHydro(pageData.slicedData),
      totalPages: pageData.totalPages
    });
    setInitLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, name, isLoading]);

  const handleSetFilter = (value: string) => {
    navigate({
      search: `?${createSearchParams({
        page: "1"
      })}`
    });
    setName(value);
  };

  return (
    <DefaultLayout>
      <Container>
        <FilterContainer>
          <TextField
            label={hydroPowerPlantsLabels.name}
            value={name}
            onChange={(value) => handleSetFilter(value)}
          />
        </FilterContainer>
        <Table
          onClick={(id: string) => navigate(slugs.hydroPowerPlant(id))}
          loading={isLoading || initLoading}
          tableDataInfo={tableData}
          labels={hydroPowerPlantsLabels}
          isFilterApplied={!!name}
        />
      </Container>
    </DefaultLayout>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  max-height: 100%;
  margin: auto;
  gap: 12px;
  padding: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  padding-left: 3px;
`;

export default HydroPowerPlantsTable;
