interface OreOptions {
  url: string;
  headers?: HeadersInit;
}

class Ore {
  private url: string;
  private headers?: HeadersInit;
  private streamEnded = false;
  private retryCount = 0;
  private maxRetries = 3;

  constructor(options: OreOptions) {
    this.url = options.url;
    this.headers = options.headers
      ? {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          ...options.headers,
        }
      : {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        };
  }

  public fetchSSE(
    onBufferReceived: (buffer: string, parts: Array<string>) => void,
    onStreamEnded?: (streamEnded: boolean) => void,
    customHeaders?: HeadersInit,
    retries: number = this.maxRetries
  ): void {
    const headers = { ...this.headers, ...customHeaders };

    const fetchWithRetry = async (): Promise<void> => {
      try {
        const response = await fetch(this.url, {
          method: "GET",
          headers: headers,
        });

        if (!response.ok) {
          throw new Error("Failed to connect to SSE endpoint");
        }

        this.retryCount = 0;

        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        const processText = ({
          done,
          value,
        }: ReadableStreamReadResult<Uint8Array>): any => {
          if (done) {
            this.streamEnded = true;
            if (onStreamEnded) {
              onStreamEnded(this.streamEnded);
            }
            return;
          }

          buffer += decoder.decode(value, { stream: true });

          const parts = buffer.split("\n\n");

          onBufferReceived(buffer, parts);

          return reader!.read().then(processText);
        };
        reader
          ?.read()
          .then(processText)
          .catch((error) => {
            if (this.retryCount < retries) {
              console.error("Error:", error);
              console.log("Retrying...");
              this.retryCount++;
              setTimeout(fetchWithRetry, 1000);
            } else {
              console.error(
                "Max retries exceeded. Cannot establish SSE connection."
              );
              this.streamEnded = true;
              if (onStreamEnded) {
                onStreamEnded(this.streamEnded);
              }
            }
          });
      } catch (error) {
        if (this.retryCount < retries) {
          console.error("Error:", error);
          console.log("Retrying...");
          this.retryCount++;
          setTimeout(fetchWithRetry, 1000);
        } else {
          console.error(
            "Max retries exceeded. Cannot establish SSE connection."
          );
          this.streamEnded = true;
          if (onStreamEnded) {
            onStreamEnded(this.streamEnded);
          }
        }
      }
    };

    fetchWithRetry();
  }
  public async fetchSSEForRSC(
    customHeaders?: HeadersInit,
    retries: number = this.maxRetries
  ) {
    const headers = { ...this.headers, ...customHeaders };

    try {
      const response = await fetch(this.url, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error("Failed to connect to SSE endpoint");
      }

      this.retryCount = 0;

      return response.body;
    } catch (error) {
      if (this.retryCount < retries) {
        console.error("Error:", error);
        console.log("Retrying...");
        this.retryCount++;
        setTimeout(() => this.fetchSSEForRSC(customHeaders, retries), 1000);
      } else {
        console.error("Max retries exceeded. Cannot establish SSE connection.");
      }
    }
  }
}

export { Ore, type OreOptions };
