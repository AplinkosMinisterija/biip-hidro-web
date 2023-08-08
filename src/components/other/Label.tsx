import styled from "styled-components";
export interface LabelProps {
  label: string;
}

const Label = ({ label }: LabelProps) => {
  return <Container>{label}</Container>;
};

const Container = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: #040f2c;
`;

export default Label;
