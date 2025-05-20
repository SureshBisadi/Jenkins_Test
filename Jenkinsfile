pipeline {
agent {label 'j-slave'}

  environment {
    VAULT_ADDR = 'http://65.2.57.33:8200'
    VAULT_ROLE_ID = '95f8cc7f-9fb4-327f-dd55-e1ed44258771'
    VAULT_SECRET_ID = '658be021-ea2b-8a8f-99e5-35278d997d17'
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
stage('Login to Vault') {
            steps {
                script {
                    // Login with AppRole and get token
                    def loginResponse = sh(script: """
                        curl --silent --request POST --data '{ "role_id": "${VAULT_ROLE_ID}", "secret_id": "${VAULT_SECRET_ID}" }' \
                        ${VAULT_ADDR}/v1/auth/approle/login
                    """, returnStdout: true).trim()

                    def loginJson = readJSON text: loginResponse
                    def vaultToken = loginJson.auth.client_token
                    env.VAULT_TOKEN = vaultToken
                }
            }
        }

        stage('Fetch DockerHub Credentials') {
            steps {
                script {
                    def secretResponse = sh(script: """
                        curl --silent --header "X-Vault-Token: ${env.VAULT_TOKEN}" \
                        ${VAULT_ADDR}/v1/kv/data/dockerhub
                    """, returnStdout: true).trim()

                    def secretJson = readJSON text: secretResponse
                    env.DOCKER_USERNAME = secretJson.data.data.username
                    env.DOCKER_PASSWORD = secretJson.data.data.password
                }
            }
        }

        stage('Login to Docker') {
            steps {
                sh """
                    echo "\n🔐 Logging in as: \$DOCKER_USERNAME"
                    echo "\$DOCKER_PASSWORD" | docker login -u "\$DOCKER_USERNAME" --password-stdin
                """
            }
        }
 }
}
