import { isEmpty, map } from "lodash";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import {
  createSearchParams,
  useNavigate,
  useSearchParams
} from "react-router-dom";
import styled from "styled-components";
import { device } from "../../styles";
import { descriptions } from "../../utils/texts";
import LoaderComponent from "../other/LoaderComponent";
import Icon from "./Icon";

export interface TableRow {
  id?: string;
  [key: string]: any;
}

export interface TableData {
  data: TableRow[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}
export interface LoginLayoutProps {
  tableDataInfo: TableData;
  labels: { [key: string]: string };
  isFilterApplied: boolean;
  onClick?: (id: string) => void;
  tableRowStyle?: any;
  loading?: boolean;
  rightButtons?: JSX.Element;
}

const Table = ({
  tableDataInfo,
  onClick,
  loading,
  labels,
  isFilterApplied
}: LoginLayoutProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries([...Array.from(searchParams)]);
  const totalPages = tableDataInfo?.totalPages || 0;
  const showPagination = !isEmpty(tableDataInfo?.data) || totalPages > 1;

  const page = "page";

  const keys = Object.keys(labels);

  const handleRowClick = (row: TableRow) => {
    if (onClick && row.id) {
      onClick(row.id);
    }
  };

  useEffect(() => {
    if (!loading && totalPages < parseInt(params?.page)) {
      navigate({
        search: `?${createSearchParams({
          [page]: "1"
        })}`
      });
    }
  }, [searchParams, tableDataInfo, loading]);

  const generateTableContent = () => {
    if (!isEmpty(tableDataInfo.data)) {
      return map(tableDataInfo.data, (row: TableRow, index: number) => (
        <TR
          $pointer={!!handleRowClick}
          key={`tr-${index}`}
          onClick={() => handleRowClick(row)}
        >
          {keys.map((label: any, i: number) => {
            return <TD key={`tr-td-${i}`}>{row[label] || "-"}</TD>;
          })}
        </TR>
      ));
    } else if (isFilterApplied) {
      return (
        <TR $pointer={false} $hide_border={true}>
          <TdSecond colSpan={keys.length}>
            {descriptions.tableNotFound}
          </TdSecond>
        </TR>
      );
    }
  };

  if (loading) return <LoaderComponent />;

  return (
    <Container>
      <TableContainer>
        <CustomTable>
          <THEAD>
            <TR $hide_border={true} $pointer={false}>
              {keys.map((key: any, i: number) => {
                return <TH key={`tr-th-${i}`}>{labels[key]}</TH>;
              })}
            </TR>
          </THEAD>
          <Tbody>{generateTableContent()}</Tbody>
        </CustomTable>
      </TableContainer>

      {showPagination && (
        <StyledReactPaginate
          pageCount={totalPages || 1}
          pageRangeDisplayed={1}
          marginPagesDisplayed={1}
          forcePage={parseInt(params?.[page]) - 1 || 0}
          onPageChange={(e) =>
            navigate({
              search: `?${createSearchParams({
                ...params,
                [page]: (e.selected + 1).toString()
              })}`
            })
          }
          containerClassName="pagination"
          activeClassName="active"
          pageLinkClassName="page-link"
          breakLinkClassName="page-link"
          nextLinkClassName="page-link"
          previousLinkClassName="page-link"
          pageClassName="page-item"
          breakClassName="page-item"
          nextClassName="page-item"
          previousClassName="page-item"
          previousLabel={<StyledIcon name="backward" />}
          nextLabel={<StyledIcon name="forward" />}
        />
      )}
    </Container>
  );
};

const Tbody = styled.tbody``;

const TableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
  padding: 16px;
`;

const CustomTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  padding: 16px;
`;

const TH = styled.th`
  text-align: left;
  font-size: 1.4rem;
  padding: 8px 14px;
  font-weight: normal;
  color: #030303;
  font-weight: bold;
`;

const TD = styled.td`
  text-align: left;
  font-size: 1.4rem;
  color: #121926;
  padding: 8px 14px;
`;

const TdSecond = styled.td`
  padding: 13px 12px;
  text-align: left;
  font-size: 1.4rem;
  color: #121926;
`;

const THEAD = styled.thead`
  width: 100%;
  background-color: #ecf6ff;
`;

const TR = styled.tr<{
  $hide_border?: boolean;
  $pointer: boolean;
}>`
  border: none !important;

  border-bottom: ${({ $hide_border }) =>
    $hide_border ? "none" : "1px solid #cdd5df"} !important;
  cursor: ${({ $pointer }) => ($pointer ? "pointer" : "default")};
`;

const Container = styled.div`
  background-color: white;
  border: 1px solid #cdd5df;
  border-radius: 4px;
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  @media ${device.mobileL} {
    align-items: center;
  }
`;

const StyledIcon = styled(Icon)`
  color: #9aa4b2;
  font-size: 1.4rem;
  cursor: pointer;
`;

const StyledReactPaginate = styled(ReactPaginate)`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0 0 17px 0;

  .page-link {
    width: 32px;
    height: 32px;
    margin: 0 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
    color: #231f20;
    border: none;
    font-size: 1.2rem;
    font-weight: bold;
    font-family: Atkinson Hyperlegible;
    cursor: pointer;
  }

  .active a {
    background: ${({ theme }) => theme.colors.primary} 0% 0% no-repeat
      padding-box !important;
    border-radius: 4px;
    border: none;
    color: white;
  }
`;

export default Table;
