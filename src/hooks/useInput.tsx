import { useState } from "react";

function useInput(defaultValue: string = "") {
  const [value, setValue] = useState<string>(defaultValue);

  const onValueChangeHandler = (
    eventOrValue: React.ChangeEvent<HTMLInputElement> | string
  ) => {
    if (typeof eventOrValue === "string") {
      setValue(eventOrValue);
    } else {
      setValue(eventOrValue.target.value);
    }
  };

  return [value, onValueChangeHandler] as const;
}

export default useInput;
