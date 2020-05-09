app.controller('vocabularyController', function($scope, $routeParams, $http, $cookies) {

    $scope.vocabularies = [];
    $scope.checkAll = false;
    $scope.selectedRows = [];
    $scope.selectedLevels = [];
    $scope.selectedDialects = [];
    $scope.allVocabularies = [];
    $scope.searchText = "";
    $scope.searchType = "e";


    $scope.changeThisLevel = function(index, level) {



        let obj = {
            level: level
        }



        $http({
            method: "PUT",
            url: $scope.rootUrl + "/api/collection/" + $scope.vocabularies[index]._id,
            data: obj,
            headers: { 'Content-Type': 'application/json', 'Process-Data': false }

        }).
        then(function success(response) {

            $scope.vocabularies[index].level = level;
            console.log($scope.vocabularies[index].level);

        }, function error(response) {
            console.log(response.statusText);
        });



    }

    $scope.selectAllRows = function() {
        if ($("#selectAll").is(":checked")) {
            for (i = 0; i < $scope.allVocabularies.length; i++) {
                $scope.selectedRows.push(i);

            }
            console.log($scope.selectedRows);
        } else {
            $scope.selectedRows = [];
        }

    }

    $scope.selectRow = function($index) {
        let id = $scope.vocabularies[$index]._id;

        if ($("#selector" + id).is(":checked")) {
            $scope.selectedRows.push($index);
        } else {
            $scope.selectedRows.splice($scope.selectedRows.indexOf($index), 1);
        }


    }

    $scope.searchVocabularies = function() {
        $scope.vocabularies = [];
        if ($scope.searchType == 'a') {
            for (i = 0; i < $scope.allVocabularies.length; i++) {
                if ($scope.allVocabularies[i].word.includes($scope.searchText)) {
                    $scope.vocabularies.push($scope.allVocabularies[i]);
                }
            }
        } else {
            for (i = 0; i < $scope.allVocabularies.length; i++) {
                if ($scope.allVocabularies[i].meaning.includes($scope.searchText)) {
                    $scope.vocabularies.push($scope.allVocabularies[i]);
                }
            }
        }
    }

    $scope.filterLevel = function(id, level) {
        if ($("#" + id).is(":checked")) {
            $scope.selectedLevels.push(level);
        } else {
            $scope.selectedLevels.splice($scope.selectedLevels.indexOf(level), 1);
        }

        $scope.vocabularies = [];

        for (i = 0; i < $scope.allVocabularies.length; i++) {
            for (j = 0; j < $scope.selectedLevels.length; j++) {
                if ($scope.allVocabularies[i].level == $scope.selectedLevels[j]) {
                    $scope.vocabularies.push($scope.allVocabularies[i]);
                    continue;
                }
            }
        }
    }

    $scope.filterDialect = function(dialect) {
        if ($("#" + dialect + "Dialect").is(":checked")) {
            $scope.selectedDialects.push(dialect);
        } else {
            $scope.selectedDialects.splice($scope.selectedDialects.indexOf(dialect), 1);
        }

        $scope.vocabularies = [];

        for (i = 0; i < $scope.allVocabularies.length; i++) {
            for (j = 0; j < $scope.selectedDialects.length; j++) {
                if ($scope.allVocabularies[i].dialect == $scope.selectedDialects[j]) {
                    $scope.vocabularies.push($scope.allVocabularies[i]);
                    continue;
                }
            }
        }
    }

    $scope.changeLevel = function(type) {

        if ($scope.selectedRows.length < 1) {
            alert("No item selected!!");
            return false;
        }

        let groupCollection = [];
        for (i = 0; i < $scope.selectedRows.length; i++) {

            let vIndex = $scope.selectedRows[i];

            let vocabulary = $scope.vocabularies[vIndex];
            groupCollection.push({ id: vocabulary._id, level: type });
        }
        let obj = {
            groupCollection: groupCollection
        }

        console.log(obj);

        $http({
            method: "POST",
            url: $scope.rootUrl + "/api/updateCollection",
            data: obj,
            headers: { 'Content-Type': 'application/json', 'Process-Data': false }

        }).
        then(function success(response) {
            for (i = 0; i < $scope.selectedRows.length; i++) {
                let element = $scope.selectedRows[i];
                $scope.vocabularies[element].level = type;
            }
        }, function error(response) {
            console.log(response.statusText);
        });



    }

    $scope.deleteMultiple = function() {
        if ($scope.selectedRows.length < 1) {
            alert("No item selected!!");
            return false;
        }
        if (confirm("Sure to delete selected items?")) {



            let groupCollection = [];

            for (i = 0; i < $scope.selectedRows.length; i++) {

                let vIndex = $scope.selectedRows[i];

                let vocabulary = $scope.vocabularies[vIndex];
                groupCollection.push({
                    id: vocabulary._id
                });
            }

            console.log(groupCollection);
            let obj = {
                groupCollection: groupCollection
            }

            console.log(obj);

            $http({
                method: "POST",
                url: $scope.rootUrl + "/api/deleteCollection",
                data: obj,
                headers: { 'Content-Type': 'application/json', 'Process-Data': false }

            }).
            then(function success(response) {
                console.log(response.data);
                console.log($scope.selectedRows);
                for (i = 0; i < $scope.selectedRows.length; i++) {


                    let element = $scope.selectedRows[i];
                    console.log(element);
                    $scope.vocabularies.splice(element, 1);


                }

                console.log($scope.vocabularies);

            }, function error(response) {
                console.log(response.statusText);
            });
        }
    }


    $scope.searchBy = function(type) {
        $scope.searchType = type;
        if (type == 'a') {
            $("#aType").addClass('siteGreen');
            $("#eType").removeClass('siteGreen');

        } else {

            $("#eType").addClass('siteGreen');
            $("#aType").removeClass('siteGreen');
        }

    }

    $scope.hideSection = function(type) {
        if ($scope.selectedRows.length < 1) {
            alert("No item selected!!");
            return false;
        }
        let prefix = type;
        for (i = 0; i < $scope.selectedRows.length; i++) {
            let element = $scope.selectedRows[i];

            let vocabulary = $scope.vocabularies[element];

            let id = vocabulary._id;

            if ($("#" + prefix + "v" + id).hasClass('fa-eye-slash')) {





                $('#' + prefix + 'show' + id).css('display', 'none');
                $('#' + prefix + 'hide' + id).css('display', 'inline');


                $("#" + prefix + "v" + id).removeClass('fa-eye-slash');
                $("#" + prefix + "v" + id).addClass('fa-eye');


            } else {



                $('#' + prefix + 'show' + id).css('display', 'inline');
                $('#' + prefix + 'hide' + id).css('display', 'none');


                $("#" + prefix + "v" + id).removeClass('fa-eye');
                $("#" + prefix + "v" + id).addClass('fa-eye-slash');
            }


        }



    }

    $scope.getVocabularies = function() {




        let userData = localStorage.getItem('user');
        let userId = JSON.parse(userData)._id;

        let data = {
            userId: userId
        }
        $http({
            method: "POST",
            url: $scope.rootUrl + "/api/collectionByUserId",
            data: data,
            headers: { 'Content-Type': 'application/json', 'Process-Data': false }

        }).
        then(function success(response) {
            console.log(response.data);
            $scope.allVocabularies = response.data.reverse();
            $scope.vocabularies = angular.copy($scope.allVocabularies);
        }, function error(response) {
            console.log(response.statusText);
        });


        // $scope.allVocabularies = [{
        //         id: "one",
        //         arabic: "",
        //         meaning: "My Name",
        //         dialect: "iraqi",
        //         phrase: "My name is John Doe",
        //         level: 'ed',
        //     },
        //     {
        //         id: "two",
        //         arabic: "",
        //         dialect: "iraqi",
        //         meaning: "My Color",
        //         phrase: "My Color is red",
        //         level: 'd',
        //     },
        //     {
        //         id: "three",
        //         arabic: "",
        //         dialect: "msa",
        //         meaning: "My hobby",
        //         phrase: "My hobby is coding",
        //         level: 'g',
        //     },
        //     {
        //         id: "four",
        //         arabic: "",
        //         dialect: "msa",
        //         meaning: "My country",
        //         phrase: "My country is a country",
        //         level: 'e',
        //     }
        // ]






    }

    $scope.selectAllBoxes = function() {

    }

    $scope.delete = function(index) {
        var vocabulary = $scope.vocabularies[index];

        if (confirm("Sure to delete?")) {
            var vocabularyId = $scope.vocabularies[index]._id;




            $http.delete($scope.rootUrl + '/api/collection/' + vocabularyId).then(function success(response) {

                $scope.vocabularies.splice(index, 1);
                console.log('vocabulary Deleted');
            });


        }
    }

    $scope.toggleContent = function(index, type) {
        let id = $scope.vocabularies[index]._id;
        console.log(id);
        let prefix = type;



        if ($("#" + prefix + "v" + id).hasClass('fa-eye-slash')) {





            $('#' + prefix + 'show' + id).css('display', 'none');
            $('#' + prefix + 'hide' + id).css('display', 'inline');


            $("#" + prefix + "v" + id).removeClass('fa-eye-slash');
            $("#" + prefix + "v" + id).addClass('fa-eye');


        } else {



            $('#' + prefix + 'show' + id).css('display', 'inline');
            $('#' + prefix + 'hide' + id).css('display', 'none');


            $("#" + prefix + "v" + id).removeClass('fa-eye');
            $("#" + prefix + "v" + id).addClass('fa-eye-slash');
        }







        // let id = $(element).attr('theId');
        // alert(id)
        // $("#" + id).text('------------');
    }
});