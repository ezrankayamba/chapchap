FROM python:3.6

RUN mkdir -p /opt/backend_rest
WORKDIR /opt/backend_rest

RUN pip install --upgrade pip

COPY ./requirements.txt /opt/backend_rest
RUN pip install -r requirements.txt

COPY . /opt/backend_rest

