import { map } from "lodash";
import styled from "styled-components";

export interface ToggleButtonProps {
  options: any[];
  onChange: (option?: any) => void;
  isSelected: (option: any) => boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  getOptionLabel?: (option: any) => string;
  error?: string;
  showError?: boolean;
}

const ButtonsGroup = ({
  options,
  onChange,
  disabled,
  isSelected,
  className,
  getOptionLabel,
  error
}: ToggleButtonProps) => {
  return (
    <Container className={className}>
      {map(options, (option, index) => (
        <StyledButton
          type="button"
          disabled={disabled || option?.disabled}
          key={`group-button${index}`}
          selected={isSelected(option)}
          error={!!error}
          onClick={() => (disabled ? {} : onChange(option))}
        >
          {getOptionLabel ? getOptionLabel(option) : option.name}
        </StyledButton>
      ))}
    </Container>
  );
};

const Container = styled.div`
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 15px #00000033;
  display: flex;
  border-radius: 4px;
  padding: 6px;
`;

const StyledButton = styled.button<{
  selected: boolean;
  disabled?: boolean;
  error?: boolean;
}>`
  display: flex;
  justify-content: center;

  align-items: center;
  padding: 6px 8px;
  font-weight: normal;
  font-size: 1.4rem;
  opacity: ${({ disabled }) => (disabled ? 0.48 : 1)};
  :hover {
    opacity: ${({ disabled }) => (disabled ? 0.48 : 0.6)};
  }
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary + "1F" : "white"};
  color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : "#030303"};
  justify-content: center;
  border-radius: 2px;
`;

export default ButtonsGroup;
