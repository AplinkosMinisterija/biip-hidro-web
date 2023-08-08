import styled from "styled-components";
import Icon from "../other/Icon";
import FieldWrapper from "./components/FieldWrapper";
import OptionsContainer from "./components/OptionsContainer";
import TextFieldInput from "./components/TextFieldInput";
import { useSelectData } from "./utils/hooks";

export interface SelectFieldProps {
  id?: string;
  name?: string;
  label?: string;
  value?: any;
  error?: string;
  showError?: boolean;
  readOnly?: boolean;
  options?: any[];
  left?: JSX.Element;
  right?: JSX.Element;
  padding?: string;
  onChange: (option: any) => void;
  disabled?: boolean;
  getOptionLabel: (option: any) => string;
  getInputLabel?: (option: any) => string;
  className?: string;
  placeholder?: string;
  backgroundColor?: string;
  hasBorder?: boolean;
  isClearable?: boolean;
  dependantId?: string;
  refreshOptions?: (dependantId?: string) => any;
}

const SelectField = ({
  label,
  value,
  name,
  error,
  hasBorder,
  showError = true,
  readOnly = false,
  placeholder,
  options,
  className,
  left,
  right,
  padding,
  getOptionLabel,
  onChange,
  disabled,
  backgroundColor,
  getInputLabel,
  isClearable = false,
  dependantId,
  refreshOptions,
  ...rest
}: SelectFieldProps) => {
  const {
    suggestions,
    input,
    handleToggleSelect,
    showSelect,
    handleBlur,
    handleClick,
    handleOnChange
  } = useSelectData({
    options,
    disabled,
    onChange,
    getOptionLabel,
    refreshOptions,
    dependantId,
    value
  });

  return (
    <FieldWrapper
      onClick={handleToggleSelect}
      handleBlur={handleBlur}
      padding={padding}
      className={className}
      label={label}
      error={error}
      showError={showError}
    >
      <TextFieldInput
        value={input}
        name={name}
        error={error}
        rightIcon={
          <>
            {value && !disabled && (
              <IconContainer
                onClick={() => !disabled && handleClick(undefined)}
              >
                <ClearIcon disabled={disabled!} name="close" />
              </IconContainer>
            )}{" "}
          </>
        }
        onChange={handleOnChange}
        leftIcon={
          <IconContainer>
            <StyledIcon name={"search"} />
          </IconContainer>
        }
        disabled={disabled}
        placeholder={(value && getOptionLabel(value)) || placeholder}
        selectedValue={value}
      />
      <OptionsContainer
        values={suggestions}
        getOptionLabel={getOptionLabel}
        loading={false}
        showSelect={showSelect}
        handleClick={handleClick}
      />
    </FieldWrapper>
  );
};

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ClearIcon = styled(Icon)<{ disabled: boolean }>`
  color: #cdd5df;
  font-size: 2.2rem;
  margin-right: 12px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const StyledIcon = styled(Icon)`
  color: #cdd5df;
  font-size: 2.2rem;
  margin-left: 12px;
`;

export default SelectField;
