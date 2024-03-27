# FastAPI Streaming Server

## Prerequisites

Before running the FastAPI server, ensure that you have the following installed:

- Docker

I would recommend [Orbstack](https://orbstack.dev), it's lightweight and requires only installation.

## Getting Started

Clone the repository via:

```bash
git clone https://github.com/glamboysa/ore.git
```

### Development Environment

To start the FastAPI server in the development environment, first go to the streaming server folder

```bash
cd examples/streaming-server
```

Then run the following command:

```bash
./start.sh
```

This command will use Docker Compose to build the development Docker image and start the server. The server will be accessible at http://localhost:8000.

## Note for macOS Users

If you encounter permission issues while running the bash scripts on macOS, you may need to give executable permissions to the scripts. You can do this by running the following commands:

```bash
chmod +x start.sh
```
