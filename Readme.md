# Default Admin Panel Credentials

ADMIN_USERNAME = admin
ADMIN_PASSWORD = admin123

# Environment Variables

# Authentication

    JWT_SECRET=your_jwt_secret_here

# Database (Neon PostgreSQL)

    DATABASE_URL=your_postgres_url_here

# AWS S3 Configuration

    AWS_S3_REGION=your_region_here
    AWS_ACCESS_KEY_ID=your_access_key_here
    AWS_SECRET_ACCESS_KEY=your_secret_key_here
    AWS_S3_BUCKET_NAME=your_bucket_name_here

# Gemini AI

    GEMINI_API_KEY=your_gemini_api_key_here

# to install docker

sudo apt install docker.io

# to install docker-compose

sudo apt install docker-compose

# Rebuild and restart services

docker-compose up --build -d

# Stop all services

docker-compose down -v

# View logs

docker logs -f airfare-backend
docker logs -f airfare-frontend

# Check DB health

docker exec -it airfare-db pg_isready -U user

# Jenkins Setup

# Update VM

sudo apt update && sudo apt upgrade -y

# Install Java (required for Jenkins)

sudo apt install openjdk-11-jdk -y
java -version

# Add Jenkins repository key

curl -fsSL https://pkg.jenkins.io/debian/jenkins.io.key | sudo tee \
 /usr/share/keyrings/jenkins-keyring.asc > /dev/null

# Add Jenkins repository

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
 https://pkg.jenkins.io/debian binary/ | sudo tee \
 /etc/apt/sources.list.d/jenkins.list > /dev/null

# Install Jenkins

sudo apt update
sudo apt install jenkins -y

# Start and enable Jenkins service

sudo systemctl start jenkins
sudo systemctl enable jenkins
sudo systemctl status jenkins

# Access Jenkins Web UI

# Open browser: http://<VM-IP>:8080

# username and password

saikumar
saikumar
