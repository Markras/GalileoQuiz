angular.module('galileo.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage, AuthFactory) {

//Generic login and register code from the course
  $scope.loginData = $localStorage.getObject('userinfo', '{}');
  $scope.reservation = {};
  $scope.registration = {};

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.login = function() {
    $scope.modal.show();
  };

  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.registerform = modal;
  });

  $scope.closeRegister = function() {
    $scope.registerform.hide();
  };

  $scope.register = function() {
    $scope.registerform.show();
  };

  $scope.doRegister = function () {
    console.log('Doing reservation', $scope.register);

    $timeout(function () {
      $scope.closeRegister();
    }, 1000);
  };

  $scope.doLogin = function() {

    $localStorage.storeObject('userinfo', $scope.loginData);

  };

  })

// This is Choice Controller used to generate buttons in the modue choice section.
        .controller('ChoiceController', ['$scope', 'quizFactory', 'choiceFactory', 'baseURL', function($scope, quizFactory, choiceFactory, baseURL) {
          $scope.baseURL = baseURL;

//property var is uploaded to factory to be served to the Quiz controller. It is the variable that allows quiz to choose appropriate questions
//Questiter var servers similar purpose, it modifies the iteration variable in the quiz controller. Once properly adapted, one of the variables will become redundant.

          $scope.setProperty = function(xxx){
            choiceFactory.setProperty(xxx);
          };

          $scope.setQuestIter = function(xxx){
            choiceFactory.setQuestIter(xxx);
          };

          $scope.modules = choiceFactory.getModule().query();
          $scope.property = choiceFactory.property;

          $scope.updateModule = function(q) {
            quizFactory.updateModule(q);
          };

          $scope.property = choiceFactory.getProperty();
          $scope.updateModule($scope.property);

        }])

//Quiz contoller
        .controller('QuizController', ['$scope', 'quizFactory', 'choiceFactory', 'baseURL', function($scope, quizFactory, choiceFactory, baseURL) {


          $scope.baseURL = baseURL;

          $scope.updateModule = function(q) {
            quizFactory.updateModule(q);
          };

          $scope.property = choiceFactory.getProperty();
          $scope.updateModule($scope.property);
          $scope.elements = quizFactory.getQuestion().query();

          $scope.setProperty = function(xxx){
            quizFactory.setProperty(xxx);
          };
          $scope.setProperty($scope.elements);

          // This functions generates new question after clicking next question button

          $scope.newQuestion = function(){
            if ($scope.iter < $scope.elements.length + choiceFactory.getQuestIter()) {
              $scope.unanswered = true;
              $scope.mess = '';
              $scope.resp = false;
              $scope.buttonStyle="button-calm";
              $scope.iter++;
              $scope.question = quizFactory.getQuestion().get({id:$scope.iter});
            } else {
              $scope.finished = true;
            };
          };

          $scope.iter = choiceFactory.getQuestIter() + 1;
          $scope.score = 0;
          $scope.buttonStyle="button-calm";
          $scope.message = quizFactory.test();
          $scope.unanswered = true;
          $scope.resp = null;
          $scope.message = '';
          $scope.buttonStyle="button-calm";
          $scope.question = quizFactory.getQuestion().get({id:$scope.iter});

          //check answer
          $scope.checkAnswer = function(y)
          {
            $scope.resp = null;
            if(y==$scope.question.answer) {
              $scope.score++;
              $scope.buttonStyle="button-balanced";
              $scope.resp = false;
              $scope.message = '';
              $scope.unanswered = false;
            }
            else {
              $scope.resp = true;
              $scope.buttonStyle="button-assertive";
              $scope.mess = "Wrong!!  " +   $scope.question.options[y] + ' is a wrong answer'
            }
          };
          // for the try again button
          $scope.resetQuestion = function(){
            $scope.resp = null;
            $scope.buttonStyle="button-calm";
            $scope.message = '';
          }

          $scope.finished = false;

        }])
        // for cotrolling the home page, code repeate from quiz controller
        .controller('IndexController', ['$scope', 'indexFactory', 'baseURL', function($scope, indexFactory, baseURL) {

                        $scope.baseURL = baseURL;
                        $scope.message="Loading ...";

                        $scope.iter = 0

                        $scope.newQuestion = function(){
                          $scope.question = indexFactory.getQuestion().get({id:$scope.iter})
                          .$promise.then(
                              function(response){
                                  $scope.question = response;
                              },
                              function(response) {
                                  $scope.message = "Error: "+response.status + " " + response.statusText;
                              });
                        }

                        $scope.newQuestion();
                        $scope.score = 0;
                        $scope.buttonStyle="button-calm";
                        $scope.mess = '';
                        $scope.unanswered = true;
                        $scope.checkAnswer = function(y)
                        {
                          $scope.resp = null;
                          if(y==$scope.question.answer) {
                            $scope.score++;
                            $scope.buttonStyle="button-balanced";
                            $scope.resp = false;
                            $scope.mess = '';
                            $scope.unanswered = false;
                          }
                          else {
                            $scope.resp = true;
                            $scope.buttonStyle="button-assertive";
                            $scope.mess = "Wrong " +   $scope.question.options[y] + ' is a wrong answer'
                          }
                        };
                        $scope.resetQuestion = function(){
                          $scope.resp = null;
                          $scope.buttonStyle="button-calm";
                          $scope.mess = '';
                        }


                    }])
//generic login code
                    .controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

                        $scope.loginData = $localStorage.getObject('userinfo','{}');

                        $scope.doLogin = function() {
                            if($scope.rememberMe)
                               $localStorage.storeObject('userinfo',$scope.loginData);

                            AuthFactory.login($scope.loginData);

                            ngDialog.close();

                        };

                        $scope.openRegister = function () {
                            ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
                        };

                    }]);
