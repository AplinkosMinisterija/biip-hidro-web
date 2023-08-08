import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { menuRoutes } from "../../utils/routes";
import AppLogo from "./AppLogo";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <Header>
      <InnerContainer>
        <AppLogo />
        <TabContainer>
          {menuRoutes.map((route) => (
            <Tab onClick={() => navigate(route.slug)}>{route.name}</Tab>
          ))}
        </TabContainer>
      </InnerContainer>
    </Header>
  );
};

export default NavBar;

const Tab = styled.div`
  font-size: 1.6rem;
  color: #121926;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TabContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
  margin: 0px 16px;
  flex-wrap: wrap;
`;

const Header = styled.div`
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 65px;
  width: 100%;

  border-bottom: 1px solid #cdd5df;
  padding: 20px;
`;

const InnerContainer = styled.div`
  flex-basis: 1200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
