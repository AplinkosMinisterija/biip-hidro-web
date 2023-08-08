import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { formLabels } from "../../utils/texts";

interface AppLogoProps {
  textColor?: string;
}

const AppLogo = ({ textColor = "#040f2c" }: AppLogoProps) => {
  const navigate = useNavigate();
  return (
    <LogoContainer onClick={() => navigate("/")}>
      <Logo src="/hydro.svg" />
      <Text color={textColor}>{formLabels.hydroPowerPlant}</Text>
    </LogoContainer>
  );
};

export default AppLogo;

const Logo = styled.img`
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  cursor: pointer;
`;

const Text = styled.div<{ color: string }>`
  font-size: 2rem;
  font-weight: bold;
  color: #040f2c;
  color: ${({ color }) => color};
`;
