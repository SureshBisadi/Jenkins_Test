pipeline {
agent {label 'j-slave}

  environment {
   VAULT_TOKEN = 'hvs.0TQg8ooz32cm9FrgbX8kxlj8'
  }

  stages{
    stage('Install Node.js') {
            steps {
                sh '''
                #!/bin/bash
                # Update package index
                sudo apt-get update
                
                # Install curl if not present
                sudo apt-get install -y curl
                
                # Download Node.js setup script and install Node.js LTS (e.g. 18.x)
                curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                sudo apt-get install -y nodejs
                
                # Verify installation
                node -v
                npm -v
                '''
            }
        }
    stage('Start'){
      steps{
      sh 'echo "Started Pipeline"'
      }
    }
    stage('CheckOut'){
      steps{
       git branch: 'main', url: 'https://github.com/SureshBisadi/Jenkins_Test'
      }
    }
    stage('List'){
      steps{
       sh 'ls'
      }
    }
    stage('Install Dependencies'){
      steps{
        sh 'npm install'
      }
    }
    stage('Build'){
      steps{
      sh 'npm run build'
      }
    }
    stage('Checkout Build'){
    steps{
      sh '''
      echo "Contents of dist directory:"
      ls -al dist/
      '''
    }
  }
    stage('Docker Build'){
      steps{
        sh 'docker build -t sureshbisadi/first-jenkinstest:latest .'
      }
    }
stage('Fetch Credentials from Vault') {
            steps {
                script {
                    def json = sh(script: """
                        curl --silent --header "X-Vault-Token: $VAULT_TOKEN" \
                        http://127.0.0.1:8200/v1/kv/data/dockerhub
                    """, returnStdout: true).trim()

                    def parsed = readJSON text: json
                    env.DOCKER_USERNAME = parsed.data.data.username
                    env.DOCKER_PASSWORD = parsed.data.data.password
                }
            }
        }
        stage('Use Credentials') {
            steps {
                sh """
                    echo "DockerHub Username: $DOCKER_USERNAME"
                    echo "Logging in to Docker..."
                    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                """
            }
        }
 }
}
