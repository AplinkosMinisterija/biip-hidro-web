import { useEffect, useState } from "react";
import { getFilteredOptions } from "./functions";

export const useSelectData = ({
  options,
  disabled,
  onChange,
  getOptionLabel
}: any) => {
  const [input, setInputValue] = useState("");
  const [showSelect, setShowSelect] = useState(false);
  const [suggestions, setSuggestions] = useState<any>(options);

  useEffect(() => {
    setSuggestions(options);
  }, [options]);

  const handleBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowSelect(false);
      setInputValue("");
    }
  };

  const handleToggleSelect = () => {
    !disabled && setShowSelect(!showSelect);
  };

  const handleClick = (option: any) => {
    setShowSelect(false);
    setInputValue("");
    onChange(option);
  };

  const handleOnChange = (input: any) => {
    if (!options) return;

    if (input) {
      setShowSelect(true);
    }
    setInputValue(input);
    setSuggestions(getFilteredOptions(options, input, getOptionLabel));
  };

  return {
    suggestions,
    input,
    handleToggleSelect,
    showSelect,
    handleBlur,
    handleClick,
    handleOnChange
  };
};
