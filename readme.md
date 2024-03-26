# Ore

> [!IMPORTANT]
> It is a WIP.

Ore is a JavaScript / TypeScript package that simplifies the consumption of Server-Sent Events (SSE) in web applications. It provides an easy-to-use interface for establishing SSE connections, handling incoming events, and implementing retry strategies in case of connection failures.

## Motivation

Consuming Server-Sent Events (SSE) or streaming data in web applications isn't always well-documented and can be complex or just plain unreliable to implement. Ore aims to simplify this process by providing a straightforward and reliable way to consume SSE streams.

## Features

- Establish SSE connections with ease.
- Handle incoming SSE events and process them accordingly.
- Implement retry strategies for reconnecting to the SSE endpoint in case of connection failures.
- Customizable headers for SSE requests.
- Set maximum retries for connection attempts.

## Install

```bash
npm install @glamboyosa/ore
```

## Usage

```typescript
import Ore from "@glamboyosa/ore";

// Initialize Ore with URL and optional headers
const ore = new Ore("http://example.com/sse-endpoint", {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
});

// Start SSE connection
ore.fetchSSE(
  (buffer, parts) => {
    console.log("Received buffer:", buffer);
    // Process the received buffer

    const b = parts[parts.length - 1];
    console.log("Received parts i.e. events", parts);
    console.log("Buffer per event", b);
    // process the buffer per event
  },
  () => {
    console.log("Stream ended");
    // Handle stream end
  }
);
```

## Class Parameters

- `url`: `string` - The URL of the SSE endpoint.
- `headers`: `HeadersInit` (optional) - Optional headers to include in the SSE request. Must be an object where keys are header names and values are header values.

## `fetchSSE` Function Parameters

- `onBufferReceived`: `function` - Callback function to handle received SSE buffers. Receives the buffer and the parts i.e. new events as a parameter.
- `onStreamEnded`: `function` - Callback function to handle stream end events. Receives the internal state of if the buffer stream is ended.
- `retries`: `number` (optional) - Optional parameter to specify the maximum number of retry attempts. Default is 3.

## Contributing

Contributions to @glamboyosa/ore are welcome! If you have suggestions for improvements or encounter any issues, feel free to open an issue or submit a pull request on GitHub.

License

This project is licensed under the MIT License.

```

```
