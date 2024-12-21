import { HtmlContext } from "next/dist/server/future/route-modules/app-page/vendored/contexts/entrypoints";
import { useEffect, useRef } from "react";

export default function useOutsideClick(callback: any) {
    const ref = useRef<HTMLDivElement>(null)
  
    useEffect(() => {
      const handleClick = (event: any) => {
        if (ref.current && !ref.current.contains(event.target)) {
            callback();
        }

      };
  
      document.addEventListener('click', handleClick);
  
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }, [ref]);
  
    return ref;
  };