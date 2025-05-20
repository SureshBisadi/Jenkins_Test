pipeline {
agent {label 'j-slave'}

  stages{
    stage('Create file'){
      steps{
       sh 'echo "Adding text from stage1" > test.txt'
      }
    }
    stage('Show file'){
      steps{
        sh 'cat test.txt'
      }
    }
  }
}
