import { isEqual, map } from "lodash";
import styled from "styled-components";

export interface Tab {
  value?: string;
  label?: string;
  route?: string;
}

const TabBar = ({
  tabs,
  activeTab,
  onClick
}: {
  tabs: Tab[];
  showOneTab?: boolean;
  activeTab: any;
  className?: string;
  onClick: (tab: Tab) => void;
}) => {
  return (
    <Container>
      {map(tabs, (tab) => {
        const isActive = isEqual(tab.value, activeTab);
        return (
          <TabButton
            key={`${tab.value}`}
            isActive={isActive}
            onClick={() => {
              onClick(tab);
            }}
          >
            <TabLabel isActive={isActive}>{tab.label}</TabLabel>
          </TabButton>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex: 1;
  white-space: nowrap;
  overflow-x: auto;
  margin-top: 30px;
`;

const TabButton = styled.div<{ isActive: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;

  border-bottom: ${({ isActive, theme }) =>
    `2px ${isActive ? theme.colors.primary : "transparent"} solid`};
  margin-right: 24px;
  cursor: pointer;
`;

const TabLabel = styled.span<{ isActive: boolean }>`
  margin: 8px 0;
  color: ${({ isActive, theme }) =>
    `${isActive ? theme.colors.primary : "#040F2C"}`};
  font-size: 1.4rem;
`;

export default TabBar;
