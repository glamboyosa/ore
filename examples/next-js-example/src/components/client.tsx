"use client";
import { useEffect, useState, useRef } from "react";
import { Ore } from "@glamboyosa/ore";
type ClientProps = {};
const ore = new Ore({
  url: "http://localhost:4000/",
  headers: {
    "Cache-Control": "no-cache",
  },
});

const Client: React.FC<ClientProps> = () => {
  const [chat, setCurrentChat] = useState("");
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      console.log("console:");
      ore.fetchSSE(
        (buffer, parts) => {
          //  console.log("Received buffer:", buffer);
          setCurrentChat(buffer);
          // Process the received buffer

          const b = parts[parts.length - 1];
          //console.log("Received parts i.e. events", parts);
          // console.log("Buffer per event", b);
        },
        (streamEnded) => {
          console.log("Stream ended", streamEnded);
        }
      );
    }
  }, []);
  return (
    <div
      suppressHydrationWarning
      className="flex w-full items-center justify-center gap-4"
    >
      <h4> Client Component:</h4>
      <p className="w-1/2">{chat}</p>
    </div>
  );
};

export default Client;
