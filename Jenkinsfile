pipeline {
    agent any
    triggers {
        githubPush()
    }
    environment {
        DOCKERHUB_CREDENTIALS = credentials('docker')
        DOCKER_USER = "${DOCKERHUB_CREDENTIALS_USR}"
        DOCKER_PASS = "${DOCKERHUB_CREDENTIALS_PSW}"
        SONARQUBE_AUTH_TOKEN = credentials('sonar-token')
    }

    stages {
        stage('Workspace Cleanup') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/theyounglord-18/PlaySuper_AirFare.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQubeServer') {
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=my-project \
                          -Dsonar.sources=. \
                          -Dsonar.language=ts \
                          -Dsonar.host.url=http://104.154.214.199:9000 \
                          -Dsonar.login=$SONARQUBE_AUTH_TOKEN \
                          -Dsonar.exclusions=**/node_modules/**,**/dist/**,.next/**
                    '''
                }
            }
        }

        stage('Prepare Backend .env') {
            steps {
                withCredentials([
                    string(credentialsId: 'AWS_ACCESS_KEY_ID', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'AWS_SECRET_ACCESS_KEY', variable: 'AWS_SECRET_ACCESS_KEY'),
                    string(credentialsId: 'GEMINI_API_KEY', variable: 'GEMINI_API_KEY'),
                    string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL')
                ]) {
                    sh '''
                    mkdir -p airfare_backend
                    cat > airfare_backend/.env <<EOL
PORT=5000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=PLAYSUPER
DATABASE_URL=${DATABASE_URL}
AWS_S3_REGION=ap-south-1
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
AWS_S3_BUCKET_NAME=airrf
GEMINI_API_KEY=${GEMINI_API_KEY}
EOL
                    '''
                }
            }
        }

        stage('Prepare Frontend .env') {
            steps {
                sh '''
                mkdir -p airfare_frontend
                cat > airfare_frontend/.env <<EOL
NEXT_PUBLIC_BACKEND_API=http://104.154.214.199:5000
NODE_ENV=development
EOL
                '''
            }
        }

        stage('Docker Login') {
            steps {
                sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
            }
        }

        stage('Build & Push with Docker Compose') {
            steps {
                sh '''
                    docker-compose -f docker-compose.yml down -v || true
                    docker-compose -f docker-compose.yml build
                    docker-compose -f docker-compose.yml push
                '''
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh '''
                    docker-compose -f docker-compose.yml up -d
                '''
            }
        }
    }
}
