FROM  python:3.12.3-bookworm

ENV PYTHONUNBUFFERED=1

WORKDIR /backend

# copy from the current directory of the Dockerfile to /backend in the image
COPY . . 

RUN pip install -r requirements.txt

EXPOSE 8000
