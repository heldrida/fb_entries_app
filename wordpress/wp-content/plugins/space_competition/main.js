angular.module('SpaceCompetitionManager', ['ngTable','ngTableExport', 'mySettings'])

.controller('listCtrl', function($scope, ngTableParams, $filter, mySettings){

	$scope.entries = [];

	function initTable(){
		
		$scope.tableParams = new ngTableParams({
		    page: 1,            // show first page
		    count: 10,           // count per page
			sorting: {
				registration_date: 'desc'     // initial sorting
			}
		}, {
		    total: $scope.entries.length, // length of data
		    getData: function($defer, params) {
				var orderedData = params.sorting() ?
				$filter('orderBy')($scope.entries, params.orderBy()) :
				$scope.entries;
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));		    	
		        //$defer.resolve($scope.entries.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		    }
		});

	};

	function getEntries(){

		// get list of entries
		jQuery.post( mySettings.wp_base_path + '/wp-admin/admin-ajax.php?action=space_competition', { option: 'entries'}, function(data){

			$scope.$apply(function(){

				$scope.entries = JSON.parse(data);

				initTable();

			});

		});

	};

	getEntries();
 
    $scope.approve = function(index, id, bool){

    	var data = {	
			id: id,
			approved: bool,
			option: 'approve'
    	};

    	//console.log(data);

		jQuery.post( mySettings.wp_base_path + "/wp-admin/admin-ajax.php?action=space_competition", data)
		.done(function( res ) {

			$scope.$apply(function(){
				
				angular.forEach($scope.entries, function(entry, key){
					
					if (entry.id === id){
						$scope.entries[key].approved = JSON.parse(res);
					};

				});

			});

		});


    };

    $scope.setApprovalClass = function(bool){
    	return parseInt(bool) ? 'check' : 'delete';
    };

    $scope.age = function(birthday) {

		birthday = new Date(birthday);
		
		var ageDifMs = Date.now() - birthday.getTime();
		var ageDate = new Date(ageDifMs);

		return Math.abs(ageDate.getUTCFullYear() - 1970);

    };

});