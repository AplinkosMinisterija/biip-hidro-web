import { useMediaQuery } from "@material-ui/core";
import Div100vh from "react-div-100vh";
import styled from "styled-components";
import { device } from "../../styles";
import MobileNavbar from "../other/MobileNavbar";
import Navbar from "../other/NavBar";

export interface DefaultLayoutProps {
  children?: React.ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const isMobile = useMediaQuery(device.mobileL);

  return (
    <Div100vh>
      <Container>
        {!isMobile ? <Navbar /> : <MobileNavbar />}
        <Content>{children}</Content>
      </Container>
    </Div100vh>
  );
};

const Content = styled.div`
  height: auto;
  width: 100%;
  padding-bottom: 20px;
`;

const Container = styled.div`
  overflow: auto;
  height: 100%;
  width: 100%;
`;

export default DefaultLayout;
