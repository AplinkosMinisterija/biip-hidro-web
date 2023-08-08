import styled from "styled-components";
import Label from "./Label";
export interface MiniGraphWrapperProps {
  label?: string;
  subLabel?: string;
  secondLabel?: string;
  children: any;
}

const MiniGraphWrapper = ({
  label,
  secondLabel,
  children
}: MiniGraphWrapperProps) => {
  return (
    <Container>
      <LabelRow>
        <Label label={label!} />
        <Label label={secondLabel!} />
      </LabelRow>
      <InnerContainer>{children}</InnerContainer>
    </Container>
  );
};

const InnerContainer = styled.div`
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  padding: 17px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default MiniGraphWrapper;
