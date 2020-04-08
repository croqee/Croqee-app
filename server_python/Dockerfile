# Setup and build the python server

FROM jjanzic/docker-python3-opencv
RUN pip install --upgrade pip
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Run the image as a non-root user
RUN adduser myuser
USER myuser

ADD ./ /usr/app/server_python/
WORKDIR /usr/app/server_python/

EXPOSE 9699
CMD ["python", "-u", "server.py"]

