pipeline {
agent {label 'j-slave'}

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
        sh 'docker build -t sureshbisadi/first-jenkinsTest:latest .'
      }
    }
    stage('Docker Login & Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push sureshbisadi/first-jenkinsTest:latest
                        docker logout
                    '''
                }
            }
        }
 }
}
