# Use an official Python runtime as a parent image

FROM node:9.8
# Set the working directory to /app

WORKDIR /app

# Copy the current directory contents into the container at /app

ADD . /app

# Run app.py when the container launches

CMD ["node", "server.js"]
