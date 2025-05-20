@Library('my-shared-lib')_

pipeline {
agent any


  stages{

    stage('Use shared library'){
      steps{
        script{
          mySharedStep()
        }
      }
      
    }
    stage('env variables'){
      steps{
        sh 'printenv'
      }
    }
  }
}
