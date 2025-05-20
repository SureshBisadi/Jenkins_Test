FROM ubuntu:20.04

# Set working directory inside the image
WORKDIR /app

# Copy build files from host into the image
COPY dist/ /app/

# Default command (noop to keep container running if needed)
CMD ["sleep", "infinity"]
