var id_user = 1;
var trec_eval = [];

var natural_a = "is weak in finding relevant results, and the quality of the retrieved results is low. Therefore, this method is generally not recommended, unless specific reasons warrant its use.";
var natural_b = "is effective in retrieving relevant results, but generally the quality of the retrieved documents is low. Therefore, this method is acceptable for queries where it is desirable to find as many relevant documents as possible.";
var natural_c = "is weak in finding relevant results in the pool of data, but the returned results are generally of high quality. Therefore, this method is acceptable for queries where the quality of the retrieved documents is more important than the number of relevant documents retrieved.";
var natural_d = "is effective in finding relevant results, and the quality of the retrieved results is good. Therefore, this method is generally recommended for all type of searches.";


$(document).ready(function (events) {
	
	//Load the Visualization API and the piechart package.
	google.load('visualization', '1.0', {'packages':['corechart']});

//	UPLOAD =====================================================
	var upload_queries = $('#upload_queries');
	var upload_qrels = $('#upload_qrels');
	var upload_runs = $('#upload_runs');
	var close = $('.close');

	close.click(function(){
		document.getElementById("upload_qrels").disabled = true;
		document.getElementById("upload_runs").disabled = true;
		document.getElementById("upload_sett").disabled = true;
		$("#status").html("");
	});
	
	upload_queries.change(function(){
		document.getElementById("upload_qrels").disabled = false;
		$("#status").html("");
	});
	
	upload_qrels.change(function(){
		document.getElementById("upload_runs").disabled = false;
		$("#status").html("");
	});

	upload_runs.change(function(){
		document.getElementById("upload_sett").disabled = false;
		$("#status").html("");
	});
	
	$("#upload_files").on('submit',(function(e) {
		e.preventDefault();
		
		$("#status").html("");
		document.getElementById("upload_sett").disabled = true;
		
		var data = new FormData();
		
		if ($('#collection_name').val() != ''){

			data.append('id_user', 1);
			
			data.append('collection_name', $('#collection_name').val());
			data.append('file-queries', upload_queries[0].files[0]);
			data.append('file-qrels', upload_qrels[0].files[0]);
			
			if (upload_runs) {
				$(upload_runs).each(function () {
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
					
					console.log(data);

					getCollections();
					
				}
			});
		}else{
			alert("Collection name");
		}
		
	}));
//==========================================================================
// show data================================================================	
	var runs_div = $(".runs_a_b");
	var trec_eval_param = $("#trec_eval_param");
	
	runs_div.hide();
	$(".coll_sett").hide();
	
	getCollections();
	
	$("#collection_sett").change(function(){
		if ($(this).val() !=-1){
			getRuns($("#collection_sett").val(), id_user);
			$(".runs_a_b").show();
		}else{
			$(".coll_sett").hide();
		}
	});
	
	$( document ).on("click", ".a a.run_item", function(e){
		e.preventDefault();		
		id = $(this).attr("id");
		text = $(this).text();
		
		$(".runs button.a>span.text").text("A: "+text);
		$(".runs button.a").val(id);
	});
	
	$( document ).on("click", ".b a.run_item", function(e){
		e.preventDefault();		
		id = $(this).attr("id");
		text = $(this).text();
		
		$(".runs button.b>span.text").text("B: "+text);
		$(".runs button.b").val(id);
	});
    
    $(document).on('click', '.compareQrels', function () {
    	$( 'span' ).removeClass( 'highlightSingle highlightPair' );
    	id = $(this).attr('id');
    	a = $(".run_data .a #"+id).text();
    	b = $(".run_data .b #"+id).text();
    	console.log(a+"---"+b+"--id: "+id);
    	if ( a == b ){
    		$(".run_data .a #"+id).addClass('highlightPair');
    		$(".run_data .b #"+id).addClass('highlightPair');
    	}else{
    		$("#"+id).addClass('highlightSingle');
    	};
    	
    });
    
// PLOT =======================================================================
    
    $("#submit_compare").click(function(){
    	var run_id_a = $(".runs button.a").val();
		var run_id_b = $(".runs button.b").val();
		var id_collection = $("#collection_sett").val();
    	if ( $(".runs button.a").val() > -1 && $('.runs button.b').val() > -1){
    		getTrec_eval(run_id_a, run_id_b, id_collection);
    		$('.chart').show();
    	}
    });
    
    trec_eval_param.change(function(){
		var param = $("#trec_eval_param").val();
		var order = $('input:radio[name="order"]:checked').val();
		drawChart(trec_eval, param, order);
	});
	
	$('input:radio[name="order"]').change(function(){
		var param = $("#trec_eval_param").val();
		var order = $('input:radio[name="order"]:checked').val();
		drawChart(trec_eval, param, order);
	});

    
});


//==GET COLLECTIONs FROM DB=============================================================
function getCollections(){
	$.get("getData.php", {data : "collections",	id_user : "1"}, 
		function(data, status){

			var collections = JSON.parse(data);
	
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
		
				var runs = JSON.parse(data);
		
				if ( !(typeof data['error'] !== "undefined" && data['error'])) {
					
					$('.runs ul').empty();
					
					$.each(runs['run_names'], function( id_runs, value ) {
						var nlg = setNLG_(id_runs);
						
						$('.runs ul.a').prepend(
							"<li role='presentation'>"+
								"<a role='menuitem' " +
									"tabindex='-1' " +
									"href='#' " +
									"data-toggle='tooltip' " +
									"class='run_item' " +
									"id='"+id_runs+"' " +
									"title='"+ value['name'] + " " + nlg +"'>" + 
									value['name'] + 
								"</a>"+
							"</li>"
						);
						$('.runs ul.b').prepend(
							"<li role='presentation'>"+
								"<a role='menuitem' " +
									"tabindex='-1' " +
									"href='#' " +
									"data-toggle='tooltip' " +
									"class='run_item' " +
									"id='"+id_runs+"' " +
									"title='"+ value['name'] + " " + nlg +"'>" + 
								value['name'] + 
								"</a>"+
							"</li>"
						);
					});
				}
			}
	);
}

//==GET Trec_Eval FROM DB and plot graf of two run======================================================
function getTrec_eval(run_id_a, run_id_b, id_collection){
	
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
		
		//================================================================
		
		$("#trec_eval_param").empty();
		
		for (var run_id in trec_eval) {
			for (var param in trec_eval[run_id]['value']) {
				if(param != 'runid'){
					$("#trec_eval_param").append("<option value='"+param+"' >"+param+"</option>");
				}
			}
			break;
		}
		
		//================================================================
		
		var param = $("#trec_eval_param").val();
		var order = $('input:radio[name="order"]:checked').val();
		
		drawChart(trec_eval, param, order);
		
	});
}

/*
 * Callback that creates and populates a data table,
 * instantiates the pie chart, passes in the data and
 * draws it.
 */
function drawChart(data_eval, param, order){
	
	var id_collection = $("#collection_sett").val();
	
	var run_name = [];
	
	var data_tail = [];
	var data_not_ordered = [];
	var v = [];
	v[1] = [];
	v[2] = [];
	v[3] = [];
	var v_a = [];
	
	var i = 0;
	
	$.each(data_eval, function(run_id, trec_eval){
		run_name[run_name.length] = trec_eval['run_name'];
		$.each(trec_eval['value'][param], function(query_id, val){
			if ( i == 0 ){
				v_a[query_id] = parseFloat(val['value']);
			}else{
				v_b = parseFloat(val['value']);
				v_d = v_a[query_id] - v_b;
				v[1][v[1].length] = {value: v_a[query_id], query_id: query_id};
				v[2][v[2].length] = {value: v_b, query_id: query_id};
				v[3][v[3].length] = {value: v_d, query_id: query_id};
				
				data_not_ordered[data_not_ordered.length] = [query_id, v_a[query_id], v_b, v_d];
			}
		});
		i++;
	});
	
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

	
	$("span#run_name_a").text(run_name[0]);
	$("span#run_name_b").text(run_name[1]);
	$("span#run_name_d").text("Diff(" + run_name[0] + " - " + run_name[1] + ")");
	
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'ID');
	data.addColumn('number', run_name[0]);
	data.addColumn('number', run_name[1]);
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
	chart.draw(data, options);

//=============================================================================
	
	google.visualization.events.addListener(chart, 'select', selectHandler);
	
	function selectHandler() {

		$(".run_data .a").empty();
		$(".run_data .b").empty();
		
		var selectedItem = chart.getSelection()[0];
		var runValues = null;
		
		if (selectedItem) {
			var id_query;
			if (order == 4){
				var cal = selectedItem.column;
				var row = data.getValue(selectedItem.row, 0);
				id_query = v[cal][row].query_id;
				
			}else{
				id_query = data.getValue(selectedItem.row, 0);
			}
//----
			var ids = ["a", "b"];
			var i = 0;
			$.each(trec_eval, function(index, value){
				var id = ids[i];
				var doc_id = [];
				$.get("getData.php",
					{
						data : "run_values",
						id_user: id_user,
						id_run: index,
						id_query: id_query,
						id_collection: id_collection
					}
				) 
				.done(function(data, status){

					runValues = JSON.parse(data);
					
					console.log(runValues);
					
					$(".run_data ."+id).append("<b>RUN: </b>"+run_name[0]+"; ");
					$(".run_data ."+id).append("<b>Query id: </b>"+id_query);
					
					$.each(runValues, function(index, value) {
						doc_arr = value.doc_id.split("/");
						doc_name = decodeURI($(doc_arr).get(-1));
						
						if  ( !(typeof doc_id[doc_name] !== "undefined")){
							doc_id[doc_name] = index;
						};
//						docClass = doc_name.replace(/[\*\^\'\!\(\)\[\]\{\}\,\.\ \"]/g, '');
						if (value.relevant > 0){
							$(".run_data ."+id).append("<br/><span class='compareQrels relevant' id='"+doc_id[doc_name]+"'>" +doc_name+ 
								  							"</span>");
						}else{
							$(".run_data ."+id).append("<br/><span class='compareQrels' id='"+doc_id[doc_name]+"'>" +doc_name+ 
								  							"</span>");
						}
					});
				});
				i++;
			});
			$(".run_data").show();
		}
	}
}

function getAVRparam(run_id, param){
	var id_collection = $("#collection_sett").val();
	var avr;

	$.ajax({
		url: 'getData.php?data=avgParam&param='+param+'&id_user='+id_user+'&id_run='+run_id+'&id_collection='+id_collection,			// Url to which the request is send
		type: "GET",				// Type of request to be send, called as method
		enctype: 'multipart/form-data',
		async: false,
		contentType: false,			// The content type used when sending data to the server.
		cache: false,				// To unable request pages to be cached
		processData:false,			// To send DOMDocument or non processed data file it is set to false
		success: function(data)		// A function to be called if request succeeds
		{
			avr = JSON.parse(data);
		}
	});
	return avr;
}

function setNLG(id){
	if ( $("#runs_"+id).val() > -1){
		var run_id = $("#runs_"+id).val();
		var avrMAP = getAVRparam(run_id, 'Mean_Average_Precision');

		var avrRecal = getAVRparam(run_id, 'recall');
		var result;
		if (avrMAP['id']<avrMAP['avrColl']){
			if(avrRecal['id']<avrRecal['avrColl']){
				result = natural_a;
			}else{
				result = natural_c;
			}
		}else{
			if(avrRecal['id']<avrRecal['avrColl']){
				result = natural_b;
			}else{
				result = natural_d;
			}
		}
		$(".naturalLG#"+id).empty();
		$(".naturalLG#"+id).append("<br/><b>"+$("#runs_"+id+" option:selected").text()+" </b><span class='naturalLG'>" + result + "</span><hr>");
		$(".naturalLG").show();
	}else{
		$(".naturalLG").hide();
		$(".naturalLG#"+id).empty();
	}
	return result;
}

function setNLG_(id){

	var run_id = id;
	var avrMAP = getAVRparam(run_id, 'Mean_Average_Precision');
	
	var avrRecal = getAVRparam(run_id, 'recall');
	var result;
	if (avrMAP['id']<avrMAP['avrColl']){
		if(avrRecal['id']<avrRecal['avrColl']){
			result = natural_a;
		}else{
			result = natural_c;
		}
	}else{
		if(avrRecal['id']<avrRecal['avrColl']){
			result = natural_b;
		}else{
			result = natural_d;
		}
	}
		
	return result;
}
