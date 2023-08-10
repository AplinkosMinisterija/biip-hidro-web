import { useMediaQuery } from "@material-ui/core";
import lt from "date-fns/locale/lt";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { device } from "../../styles";
import Icon from "../other/Icon";

registerLocale("lt", lt);

export interface DatepickerProps {
  value?: Date | string;
  onChange: (date?: Date) => void;
  onClose: () => void;
  open: boolean;
}

const Datepicker = ({ value, onChange, open, onClose }: DatepickerProps) => {
  const isMobile = useMediaQuery(device.mobileL);

  return (
    <>
      {open && (
        <Container>
          <DateContainer>
            {isMobile && (
              <div onClick={() => onClose()}>
                <CloseIcon name="close" />
              </div>
            )}
            <DatePicker
              locale="lt"
              open={open}
              selected={value ? new Date(value as any) : null}
              onClickOutside={() => onClose()}
              onSelect={() => onClose()}
              onChange={(date: Date) => {
                onChange(date);
                onClose();
              }}
              inline
            ></DatePicker>
          </DateContainer>
        </Container>
      )}
    </>
  );
};

const DateContainer = styled.div`
  position: absolute;
  &:focus {
    outline: none;
  }
  left: 200px;
  top: 50px;
  @media ${device.mobileL} {
    position: fixed;
    z-index: 9;
    left: 0px;
    top: 0px;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.4);
  }
`;

const CloseIcon = styled(Icon)`
  color: white;
  font-size: 2.8rem;
  align-self: center;
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
`;

const Container = styled.div`
  width: 100%;
  &:focus {
    outline: none;
  }
  .react-datepicker__header {
    color: #121a55;
    background-color: #ffffff !important;
    border: none;
  }
  .react-datepicker__month {
    margin: 0;
  }
  .react-datepicker__day--outside-month {
    color: #151229;
    opacity: 0.6;
  }
  .react-datepicker__input-time-container {
    text-align: center;
  }
  .react-datepicker__triangle {
    display: none;
  }
  .react-datepicker__day {
    &:focus {
      outline: none;
    }
 f;
    margin: 26px 32px 0px 0px;
    position: relative;
    font: normal normal normal 1.5rem/21px "Roboto", sans-serif;
    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary};
      &::before {
        content: "";
        position: absolute;
        background-color: ${({ theme }) => theme.colors.secondary};
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
        width: 50px;
        height: 50px;
        border-radius: 25px;
      }
    }

    @media ${device.mobileS} {
      margin: 26px 16px 0px 0px;
      &:hover {
        &::before {
          content: "";
          width: 30px;
          height: 30px;
        }
      }
    }
  }
  .react-datepicker__input-time-container {
    margin: 0;
  }
  .react-datepicker {
    width: 364px;
    position: absolute;
    top: 0px;
    z-index: 2;
    background-color: #ffffff;
    box-shadow: 0px 2px 16px #121a5529;
    border-radius: 10px;
    padding: 0px 26px 20px 26px;
    border: none;
    @media ${device.mobileL} {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    @media ${device.mobileS} {
      width: 95%;
    }
  }
  .react-datepicker-time__caption {
    font: normal normal 600 1.6rem/40px "Roboto", sans-serif;
    display: block !important;
    margin: 15px 0px 10px 0px;
    text-align: center;
    color: #0b1f51;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  .react-datepicker__day--selected {
    background-color: white;
    position: relative;
    z-index: 1;
    font: normal normal normal 1.5rem/21px "Roboto", sans-serif;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: white;
    font: normal normal normal 1.5rem/21px "Roboto", sans-serif;
    color: #121a55;
  }
  .react-datepicker__day--selected::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    background-color: ${({ theme }) => theme.colors.secondary};
    width: 50px;
    height: 50px;
    border-radius: 25px;
  }

  @media ${device.mobileS} {
    .react-datepicker__day--selected::before {
      content: "";
      width: 30px;
      height: 30px;
    }
  }
  .react-datepicker__day-name {
    font: normal normal bold 14px/19px "Roboto", sans-serif;
    letter-spacing: 0px;
    color: #151229;
    margin: 26px 32px 0px 0px;
    border: none;
  }

  @media ${device.mobileS} {
    .react-datepicker__day-name {
      margin: 26px 16px 0px 0px;
    }
  }
  .react-datepicker__navigation {
    top: 20px;
  }
  .react-datepicker__current-month {
    text-align: center;
    font: normal normal 600 1.6rem/22px "Roboto", sans-serif;
    letter-spacing: 0px;
    color: #121a55;
    margin-top: 13px;
    text-transform: capitalize;
  }
  .react-datepicker__navigation--previous {
    left: 17px;
  }
  .react-datepicker__navigation--next {
    right: 17px;
  }
  .react-datepicker__month-container {
    float: none;
  }
`;

export default Datepicker;
