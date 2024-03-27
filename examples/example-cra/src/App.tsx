import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Ore } from "@glamboyosa/ore";
import { useEffect, useRef, useState } from "react";
const ore = new Ore({
  url: "http://localhost:4000/",
  headers: {
    "Cache-Control": "no-cache",
  },
});

function App() {
  const [chat, setCurrentChat] = useState("");
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      console.log("console:");
      ore.fetchSSE(
        (buffer, parts) => {
          console.log("Received buffer:", buffer);
          setCurrentChat(buffer);
          // Process the received buffer

          const b = parts[parts.length - 1];
          console.log("Received parts i.e. events", parts);
          console.log("Buffer per event", b);
        },
        (streamEnded) => {
          console.log("Stream ended", streamEnded);
        }
      );
    }
  }, []);
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>Stream:</p>
        <p>{chat}</p>
      </div>
    </>
  );
}

export default App;
