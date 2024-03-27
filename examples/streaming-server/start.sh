#!/bin/bash

# Build the Docker image
docker build -t fast .

# Run the Docker container
docker run fast
