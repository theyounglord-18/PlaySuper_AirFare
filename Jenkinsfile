pipeline {
    agent any
    triggers{
        githubPush()
    }
    environment{
        DOCKERHUB_CREDENTIALS = credentials('docker')
        DOCKER_USER = "${DOCKERHUB_CREDENTIALS_USR}"
        DOCKER_PASS = "${DOCKERHUB_CREDENTIALS_PSW}"
        
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
NEXT_PUBLIC_BACKEND_API=http://35.239.183.144:5000
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
        stage('Remove Old Containers & Images') {
            steps {
                sh '''
                    docker rm -f airfare-backend || true
                    docker rm -f airfare-frontend || true
                    docker rm -f airfare-network || true
                    docker rmi -f $DOCKER_USER/playsuper_backend:latest || true
                    docker rmi -f $DOCKER_USER/playsuper_frontend:latest || true
                '''
            }
        }
        stage('Push Images to DockerHub') {
    steps {
        sh """
            docker tag airfaredeploy_backend:latest $DOCKER_USER/playsuper_backend:latest
            docker push $DOCKER_USER/playsuper_backend:latest
            docker tag airfaredeploy_frontend:latest $DOCKER_USER/playsuper_frontend:latest
            docker push $DOCKER_USER/playsuper_frontend:latest
        """
    }
}

        stage('Build & Deploy with Docker Compose') {
    steps {
        // Build Docker images
        sh 'docker-compose -f docker-compose.yml build --no-cache'

        // Stop any running containers and remove volumes, then start containers in detached mode
        sh '''
            docker-compose -f docker-compose.yml down -v || true
            docker-compose -f docker-compose.yml up -d
        '''
    }
}
        
    }
}
