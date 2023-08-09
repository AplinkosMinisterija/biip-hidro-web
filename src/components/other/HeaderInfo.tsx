import styled from "styled-components";
import { device } from "../../styles";
import { descriptions } from "../../utils/texts";
import { HydroPowerPlant } from "../../utils/types";
export interface LabelProps {
  label: string;
}

const HeaderInfo = ({
  hydroPowerPlant
}: {
  hydroPowerPlant: HydroPowerPlant;
}) => {
  const { upperBasinMin, upperBasinMax, lowerBasinMin } = hydroPowerPlant;

  const info = [
    { value: upperBasinMin, description: descriptions.upperBasinMin },
    { value: upperBasinMax, description: descriptions.upperBasinMax },
    { value: lowerBasinMin, description: descriptions.lowerBasinMin }
  ];

  return (
    <HeaderContainer>
      {info.map((item) => (
        <HeaderInfoItem>
          <HeaderInfoValue>{item?.value || "-"}</HeaderInfoValue>
          <HeaderInfoText>{item.description}</HeaderInfoText>
        </HeaderInfoItem>
      ))}
    </HeaderContainer>
  );
};

export default HeaderInfo;

const HeaderContainer = styled.div`
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
