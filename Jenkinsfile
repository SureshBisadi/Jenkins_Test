pipeline {
agent none

  stages{
    stage('Create file'){
      agent any
      steps{
       sh 'echo "Adding text from stage1" > test.txt'
       stash-name: 'file-data', includes: 'test.txt'
      }
    }
    stage('Show file'){
      agent any
      steps{
        unstash 'file-data'
        sh 'cat test.txt'
      }
    }
  }
}
