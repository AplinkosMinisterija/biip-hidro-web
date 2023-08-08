import styled from "styled-components";
export interface ViolationCountMessageProps {
  count: number;
}

const ViolationCountMessage = ({ count }: ViolationCountMessageProps) => {
  if (!count) return <></>;

  return (
    <Container>
      <Icon src="/alert.svg" />
      <Text>
        Fiksuoti <Value>{count}</Value> pažeidimai
      </Text>
    </Container>
  );
};

const Container = styled.div`
  background-color: #ab083c14;
  border: 1px solid #ab083c66;
  border-radius: 4px;
  padding: 8px 12px;
  display: flex;
  gap: 4px;
`;

const Icon = styled.img`
  width: 24px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Text = styled.div`
  color: #ab083c;
  font-size: 1.4rem;
  display: flex;
  gap: 4px;
`;

const Value = styled.div`
  font-weight: bold;
`;

export default ViolationCountMessage;
