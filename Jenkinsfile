pipeline {
agent {label 'j-slave'}

  stages{
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
      sh 'npm run dev'
      }
    }
    stage('Checkout Build'){
    steps{
      sh 'cd dist'
      sh 'ls'
    }
  }
 }
}
