var id_user = 1;
var data_eval = [];

$(document).ready(function (events) {
	
	//Load the Visualization API and the piechart package.
	google.load('visualization', '1.0', {'packages':['corechart']});

	var queries = $('#queries');
	var qrels = $('#qrels');
	var runs = $('#runs');
	var close = $('#close');
	var upload = $('#upload_img');
	var runs_div = $("#runs_a_b");
	var trec_eval_param = $("#trec_eval_param");
	
	runs_div.hide();
	$("#chart_param").hide();
	
	getCollections();
	
	$("#collection_sett").change(function(){
		if ($(this).val() !=-1){
			getRuns($("#collection_sett").val(), id_user);
			$("#runs_a_b").show();
		}else{
			$("#runs_a_b").hide();
		}
	});
	
	upload.click(function(){
		$(".popup").css('visibility', 'visible');
	});
	
	close.click(function(){
		$(".popup").css('visibility', 'hidden');
		document.getElementById("qrels").disabled = true;
		document.getElementById("runs").disabled = true;
		document.getElementById("upload").disabled = true;
		$("#status").html("");
	});
	
	queries.change(function(){
		document.getElementById("qrels").disabled = false;
		$("#status").html("");
	});
	
	qrels.change(function(){
		document.getElementById("runs").disabled = false;
		$("#status").html("");
	});

	runs.change(function(){
		document.getElementById("upload").disabled = false;
		$("#status").html("");
	});
	
	trec_eval_param.change(function(){
		var param = $("#trec_eval_param").val();
		var order = $('input:radio[name="order"]:checked').val();
		drawChart(data_eval, param, order);
	});
	
	$('input:radio[name="order"]').change(function(){
		var param = $("#trec_eval_param").val();
		var order = $('input:radio[name="order"]:checked').val();
		drawChart(data_eval, param, order);
	});

	$("#upload_files").on('submit',(function(e) {
		e.preventDefault();
		
		$("#status").html("");
		document.getElementById("upload").disabled = true;
		
		var data = new FormData();
		
		if ($('#collection_name').val() != ''){

			data.append('id_user', 1);
			
			data.append('collection_name', $('#collection_name').val());
			data.append('file-queries', queries[0].files[0]);
			data.append('file-qrels', qrels[0].files[0]);
			
			if (runs) {
				$(runs).each(function () {
					var i = 0;
			        $(this.files).each(function () {
			        	data.append('file-runs-'+i, this);
			        	i++;
			        });
				});
			}
			
			$.ajax({
				url: "uploadToDB.php",			// Url to which the request is send
				type: "POST",				// Type of request to be send, called as method
				enctype: 'multipart/form-data',
				data: data, 				// Data sent to server, a set of key/value pairs (i.e. form fields and values)
				contentType: false,			// The content type used when sending data to the server.
				cache: false,				// To unable request pages to be cached
				processData:false,			// To send DOMDocument or non processed data file it is set to false
				success: function(data)		// A function to be called if request succeeds
				{
					$("#status").html("<img src='./img/accept-db.png' id='ok_img' alt='Upload' height='32' width='32'/>");
					getCollections();
				}
			});
		}else{
			alert("Collection name");
		}
		
	}));

    $("#submit_compare").click(function(){
    	if ( $("#runs_a").val() > -1 && $('#runs_b').val() > -1){
    		getTrec_eval();
    	}
    });
    
    $(document).on('click', '.compareQrels', function () {
    	id = $(this).attr('id');
    	$( 'span' ).removeClass( 'highlight' );
    	$("#"+id).addClass('highlight');
    });
    
});

function compareSecondColumn(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] > b[1]) ? -1 : 1;
    }
}

//==GET COLLECTIONs FROM DB=============================================================
function getCollections(){
	$.get("getData.php", {
							data : "collections",
							id_user : "1"
							}, 
		function(data, status){

			var collections =JSON.parse(data);
	
			if (typeof collections['error'] == "Undefined" || !collections['error']) {
				$("#collection_sett").empty();
				
				$("#collection_sett").append("<option value='-1' >Choose Collection</option>");
				
				$.each(collections['collections'], function( id_collection, value ) {
					$("#collection_sett").append("<option value='"+id_collection+"' >" + value['name'] + "</option>");
				});
	
			}else{
				console.log("test error============="+data);
			}
		}
	);
}

//==GET RUNs FROM DB=============================================================
function getRuns(id_collection, id_user){
	
	$.get("getData.php", 
			{ data: "runs_names", 
				id_user: id_user , 
				id_collection: id_collection}, 
			function(data, status){
		
				var runs =JSON.parse(data);
		
				if ( !(typeof data['error'] !== "undefined" && data['error'])) {
					$("#runs_a").empty();
					$("#runs_b").empty();
					
					$("#runs_a").append("<option value='-1' >Choose metod A</option>");
					$("#runs_b").append("<option value='-1' >Choose metod B</option>");
					
					$.each(runs['run_names'], function( id_runs, value ) {
						$("#runs_a").append("<option value='"+id_runs+"' >" + value['name'] + "</option>");
						$("#runs_b").append("<option value='"+id_runs+"' >" + value['name'] + "</option>");
					});
					
				}
			}
	);
}

//==GET Trec_Eval FROM DB and plot graf of two run======================================================
function getTrec_eval(){
	
	var run_id_a = $("#runs_a").val();
	var run_id_b = $("#runs_b").val();
	var id_collection = $("#collection_sett").val();
	
	$.get(	"getData.php", 
			{ 	data: "compareTwoRun", 
				id_user: id_user, 
				id_collection: id_collection, 
				run_id_a: run_id_a, 
				run_id_b: run_id_b
			}
	) 
	.done(function(data, status){
		trec_eval = JSON.parse(data);
		
		data_eval = [];
		$.each(trec_eval, function(run_id, run_val) {
			if ( !(typeof( data_eval[run_id] ) !== "undefined" && data_eval[run_id]) ) {
		    	data_eval[run_id] = [];
		    }

			$.each(run_val, function(index, value) {
				$.each(value, function(eval_id, val) {
				    if ( !(typeof( data_eval[run_id][eval_id] ) !== "undefined" && data_eval[run_id][eval_id]) ) {
				    	data_eval[run_id][eval_id] = [];
				    }
				    if ( !(typeof( data_eval[run_id][eval_id][index] ) !== "undefined" && data_eval[run_id][eval_id][index]) ) {
						data_eval[run_id][eval_id][index] = [];
					}
				    
					data_eval[run_id][eval_id][index] = val;
				});
			});
		});
		
	//================================================================
		
		$("#trec_eval_param").empty();
		
		for (var run_id in data_eval) {
			for (var eval_id in data_eval[run_id]) {
				if(eval_id != 'runid'){
					$("#trec_eval_param").append("<option value='"+eval_id+"' >"+eval_id+"</option>");
				}
			}
			break;
		}
		
	//================================================================
		
		var param = $("#trec_eval_param").val();
		var order = $('input:radio[name="order"]:checked').val();
		
		drawChart(data_eval, param, order);
		
	});
}

/*
 * Callback that creates and populates a data table,
 * instantiates the pie chart, passes in the data and
 * draws it.
 */
function drawChart(data_eval, param, order){
	var runs_id = ['A', 'B'];
	var i = 0;
	for (var id in data_eval){
		runs_id[i++] = id;	
	}
	
	var run_id_a = $("#runs_a").val();
	var run_id_b = $("#runs_b").val();
	var run_name_a = runs_id[0];
	var run_name_b = runs_id[1];
	var id_collection = $("#collection_sett").val();
	
	var data_tail = [];
	var data_not_ordered = [];
	var v = [];
	v[1] = [];
	v[2] = [];
	v[3] = [];
	var v_a = [];
	
	var i = 0;
	
	for (var run_id in data_eval) {
		for (var query_id in data_eval[run_id][param]) {
			if ( i == 0 ){
				v_a[query_id] = parseFloat(data_eval[run_id][param][query_id]);
			}else{
				v_b = parseFloat(data_eval[run_id][param][query_id]);
				v_d = v_a[query_id] - v_b;
				v[1][v[1].length] = {value: v_a[query_id], query_id: query_id};
				v[2][v[2].length] = {value: v_b, query_id: query_id};
				v[3][v[3].length] = {value: v_d, query_id: query_id};
				
				data_not_ordered[data_not_ordered.length] = [query_id, v_a[query_id], v_b, v_d];
			}
		}
		i++;
	}
//	ordering of data ====================================================================
	if (order == 4){
		v[1].sort(function(a, b){
			return b.value-a.value;
		});
		v[2].sort(function(a, b){
			return b.value-a.value;
		});
		v[3].sort(function(a, b){
			return b.value-a.value;
		});
		
		for (var index in v[1]) {
			data_tail[data_tail.length] = [index, v[1][index].value, v[2][index].value, v[3][index].value];
		}
	}else{
		data_tail = data_not_ordered.sort(function(a, b){
		    var a1 = a[order], b1 = b[order];
		    if(a1 == b1) return 0;
		    return a1 < b1 ? 1: -1;
		});
	}
//=======================================================================================	

	
	$("span#run_name_a").text(run_name_a);
	$("span#run_name_b").text(run_name_b);
	$("span#run_name_d").text("Diff(" + run_name_a + " - " + run_name_b + ")");
	
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'ID');
	data.addColumn('number', run_name_a);
	data.addColumn('number', run_name_b);
	data.addColumn('number', 'Diff');
	
	data.addRows(data_tail);
	
	var options = {
			title: param,
			curveType: 'function',
			legend: { position: 'bottom' },
			height: 500,
			explorer: {maxZoomIn: .01} ,
			lineWidth: 1
		};

	var chart = new google.visualization.LineChart(document.getElementById("plot"));
	$("#chart_param").show();
	chart.draw(data, options);

//=============================================================================
	
	google.visualization.events.addListener(chart, 'select', selectHandler);
	
	function selectHandler() {

		$(".trec_eval_data#a").empty();
		$(".trec_eval_data#b").empty();
		
		var selectedItem = chart.getSelection()[0];
		var runValues_a = null;
		
		if (selectedItem) {
			var id_query;
			if (order == 4){
				var cal = selectedItem.column;
				var row = data.getValue(selectedItem.row, 0);
				id_query = v[cal][row].query_id;
				
			}else{
				id_query = data.getValue(selectedItem.row, 0);
			}

			$.get("getData.php",
				{
					data : "run_values",
					id_user: id_user,
					id_run: run_id_a,
					id_query: id_query,
					id_collection: id_collection
				}
			) 
			.done(function(data, status){

				runValues_a = JSON.parse(data);
				$(".trec_eval_data#a").append("<b>RUN: </b>"+run_name_a+"; ");
				$(".trec_eval_data#a").append("<b>Query id: </b>"+id_query);
				
				$.each(runValues_a, function(index, value) {
					doc_arr = value.doc_id.split("/");
					doc_name = decodeURI($(doc_arr).get(-1));
					if (value.relevant > 0){
						$(".trec_eval_data#a").append("<br/><span class='compareQrels relevant' id='"+doc_name+"'>" + 
								  							value.doc_id + 
							  							"</span>");
					}else{
						$(".trec_eval_data#a").append("<br/><span class='compareQrels' id='"+doc_name+"'>" + 
								  							value.doc_id + 
							  							"</span>");
					}
				});
			});
	    		  
			$.get("getData.php",
				{
					data : "run_values",
					id_user: id_user,
					id_run: run_id_b,
					id_query: id_query,
					id_collection: id_collection
				}
			) 
			.done(function(data, status){
				
				runValues_b = JSON.parse(data);
				$(".trec_eval_data#b").append("<b>RUN:</b> "+run_name_b+"; ");
				$(".trec_eval_data#b").append("<b>Query id:</b> "+id_query);
				
				$.each(runValues_b, function(index, value) {
					doc_arr = value.doc_id.split("/");
					doc_name = decodeURI($(doc_arr).get(-1));
					if (value.relevant > 0){
						$(".trec_eval_data#b").append("<br/><span class='compareQrels relevant' id='"+doc_name+"'>" + 
							  							value.doc_id + "</span>");
					}else{
						$(".trec_eval_data#b").append("<br/><span class='compareQrels' id='"+doc_name+"'>" + 
							  							value.doc_id + "</span>");
					}
				});
			});
	
		}
	}
}

