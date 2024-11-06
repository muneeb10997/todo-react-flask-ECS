FROM python:3.10.12
 
WORKDIR /app

COPY . .

RUN apt-get update && apt-get install -y \ 
    default-libmysqlclient-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*
    
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["python", "app.py"]
