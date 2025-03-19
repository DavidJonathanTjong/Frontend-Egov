import { useState } from "react";

function useInput(defaultValue: string = "") {
  const [value, setValue] = useState<string>(defaultValue);

  const onValueChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return [value, onValueChangeHandler] as const;
}

export default useInput;
