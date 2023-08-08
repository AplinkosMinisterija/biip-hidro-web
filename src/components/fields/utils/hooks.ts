import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { GetAllResponse } from "../../../utils/api";
import { handleResponse } from "../../../utils/functions";
import { getFilteredOptions } from "./functions";

export const useAsyncSelectData = ({
  setSuggestionsFromApi,
  disabled,
  onChange
}: any) => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<any>([]);
  const [hasMore, setHasMore] = useState(false);
  const [input, setInput] = useState("");
  const [showSelect, setShowSelect] = useState(false);

  const handleBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowSelect(false);
      setInput("");
    }
  };

  const handleClick = (option: any) => {
    setShowSelect(false);
    setInput("");
    setSuggestions([]);
    setCurrentPage(0);
    onChange(option);
  };

  useEffect(() => {
    if (isEmpty(suggestions) && showSelect) {
      handleLoadData("", 0);
    }
  }, [showSelect]);

  const handleLoadData = async (
    input: string,
    page: number,
    lazyLoading = false
  ) => {
    setLoading(true);
    handleResponse({
      endpoint: () => setSuggestionsFromApi(input, page),
      onSuccess: (list: GetAllResponse<any>) => {
        setCurrentPage(list.page);
        setSuggestions(
          lazyLoading ? [...suggestions, ...list.rows] : list.rows
        );
        setHasMore(list.page < list.totalPages);
        setLoading(false);
      }
    });
  };

  const handleScroll = async (e: any) => {
    const element = e.currentTarget;
    const isTheBottom =
      Math.abs(
        element.scrollHeight - element.clientHeight - element.scrollTop
      ) < 1;

    if (isTheBottom && hasMore && !loading) {
      handleLoadData(input, currentPage + 1, true);
    }
  };

  const handleToggleSelect = () => {
    !disabled && setShowSelect(!showSelect);
  };

  const handleInputChange = (input: any) => {
    if (input) {
      setShowSelect(true);
    }
    setInput(input);
    handleLoadData(input, 0);
  };

  return {
    loading,
    suggestions,
    handleScroll,
    input,
    handleInputChange,
    handleToggleSelect,
    showSelect,
    handleBlur,
    handleClick
  };
};

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
