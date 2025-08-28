import { useRef, useEffect, useState } from "react";

function Result({ result }: { result: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={result}
      className="w-full h-full p-0 m-0 overflow-auto break-words flex justify-center items-center"
      sandbox=""
    />
  );
}

export default Result;
