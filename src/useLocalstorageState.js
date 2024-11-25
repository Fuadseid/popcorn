import { useState,useEffect } from "react";

export function useLocalstorageState(initialvalue,key) {
  const [value, setvalue] = useState(function () {
    const storageValue = localStorage.getItem(key);
    return storageValue? JSON.parse(storageValue):initialvalue;
  });

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(value));
    },
    [value]
  );
 
return [value,setvalue]
  
}
