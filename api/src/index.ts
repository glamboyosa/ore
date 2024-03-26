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
    this.headers = options.headers;
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
        const _processText = ({
          done,
          value,
        }: ReadableStreamReadResult<Uint8Array>) => {
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

          reader?.read().then(_processText);
        };
        reader?.read().then();
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
}

export { Ore, OreOptions };
