var id_user = 1;
var relevance = [];



// Define a plain object
var collection_o = { id: "-1", name: "NaN" };
 
// Pass it to the jQuery function
var $collection = $( collection_o );

$collection.on( "changeCollection", function () {
	
	var id = $("#collection_sett").val();
	var name = $("#collection_sett option:selected").text();
	
	$(this).prop( "id", id );
	$(this).prop( "name", name );
	
	$(this).prop("compare", { a: -1, b: -1 });
	
	$(".chart").hide();
	$("#plot").empty();
	
	$(".runs button.a>span.text").text("A: ");
	$(".runs button.a").val(-1);
	
	$(".runs button.b>span.text").text("B: ");
	$(".runs button.b").val(-1);
	
	if ($(this).prop("id") !=-1){
		getRuns($(this).prop("id"), id_user);
		$(".runs_a_b").show();
		overview($(this).prop("id"));
	}else{
		$(".coll_sett").hide();
		$("#overview").empty();
	}
});

$collection.on( "compareToRuns", function () {
	
	var run_id_a = $(".runs button.a").val();
	var run_id_b = $(".runs button.b").val();
	var id_collection = $("#collection_sett").val();
	
	if ( run_id_a > -1 && run_id_b > -1){
		$(this).prop("compare", { a: run_id_a, b: run_id_b });
		
		getTrec_eval(run_id_a, run_id_b, id_collection);
			
		setParam();
	
		setNL();
		
		var param = $("#trec_eval_param").val();
		var order = $('input:radio[name="order"]:checked').val();
		var trec_eval = { a: $collection.prop("runs")[run_id_a], b: $collection.prop("runs")[run_id_b] };
		
		drawLineChart(trec_eval, param, order, 3);
		
		$('.chart').show();
		
	}
});


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

					getCollections();
					
				}
			});
		}else{
			alert("Collection name");
		}
		
	}));
//==========================================================================
// show data================================================================	
	$(".runs_a_b").hide();
	
	$(".coll_sett").hide();
	
	getCollections();
	
	$("#collection_sett").change(function(){

		$collection.trigger( "changeCollection" );

	});
	
	$( document ).on("click", ".a a.run_item", function(e){
		e.preventDefault();		
		var id = $(this).attr("id");
		var text = $(this).text();
		
		$(".runs button.a>span.text").text("A: "+text);
		$(".runs button.a").val(id);
	});
	
	$( document ).on("click", ".b a.run_item", function(e){
		e.preventDefault();		
		var id = $(this).attr("id");
		var text = $(this).text();
		
		$(".runs button.b>span.text").text("B: "+text);
		$(".runs button.b").val(id);
	});
    
	//highlight comparing two runs result
    $(document).on({
    		click: function() {
    			$( 'span' ).removeClass( "highlightSingleClick highlightPairClick" );
    			id = $(this).attr('id');
    			
    	    	if ( $("."+id).length == 2 ){
    	    		$("."+id).addClass('highlightPairClick');
    	    	}else{
    	    		$("."+id).addClass('highlightSingleClick');
    	    	};
    		}, mouseenter: function() {
    			id = $(this).attr('id');
    			
    			if ( $("."+id).length == 2 ){
    	    		$("."+id).addClass('highlightPair');
    	    	}else{
    	    		$("."+id).addClass('highlightSingle');
    	    	};
    		}, mouseleave: function() {
    			$( 'span' ).removeClass( "highlightSingle highlightPair" );
    		}
		}, '.compareQrels');
    
// PLOT =======================================================================
    
    $("#submit_compare").click(function(){
    	
    	$collection.trigger("compareToRuns");
    	
    });
    
    $("#trec_eval_param").change(function(){
    	var a = $collection.prop("compare").a;
    	var b = $collection.prop("compare").b;

    	var trec_eval = { a: $collection.prop("runs")[a], b: $collection.prop("runs")[b] };

		var param = $("#trec_eval_param").val();
		var order = $('input:radio[name="order"]:checked').val();
		
		if (param == "runs_relevance"){
			RunRel($collection.prop("id"), $collection.prop("compare").a, $collection.prop("compare").b);
		}else{
				
			drawLineChart(trec_eval, param, order, 3);

		}
		
	});
	
	$('input:radio[name="order"]').change(function(){
		var a = $collection.prop("compare").a;
    	var b = $collection.prop("compare").b;
    	
    	var trec_eval = { a: $collection.prop("runs")[a], b: $collection.prop("runs")[b] };
    	
		var param = $("#trec_eval_param").val();
		var order = $('input:radio[name="order"]:checked').val();
		
		drawLineChart(trec_eval, param, order, 3);
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

//==GET RUNs names by collection_id FROM DB=============================================================
function getRuns(id_collection, id_user){
	
	$.get("getData.php", 
		{ data: "runs_names", 
			id_user: id_user , 
			id_collection: id_collection}, 
		function(data, status){
	
			var runs = JSON.parse(data);
			
			if ( !(typeof data['error'] !== "undefined" && data['error'])) {
				
				$collection.prop("runs", runs);
				
				$('.runs ul').empty();
				
				$.each(runs, function( id_runs, value ) {
					var nlg = setNLG_(id_runs);
					
					$('.runs ul.a').prepend(
						"<li role='presentation'>"+
							"<a role='menuitem' " +
								"tabindex='-1' " +
								"href='#' " +
								"data-toggle='tooltip' " +
								"class='run_item' " +
								"id='"+id_runs+"' " +
								"title='"+ value['run_name'] + " " + nlg +"'>" + 
								value['run_name'] + 
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
								"title='"+ value['run_name'] + " " + nlg +"'>" + 
							value['run_name'] + 
							"</a>"+
						"</li>"
					);
				});
			}
		}
	);
}

//get relevance from RUNs
function RunRel(id_collection, run_id_a, run_id_b){
	var get_data = 'data=compareTwoRunRel&id_user='+id_user+'&run_id_a='+run_id_a+'&run_id_b='+run_id_b+'&id_collection='+id_collection; 
	$.ajax({
		url: 'getData.php?'+get_data,			// Url to which the request is send
		type: "GET",				// Type of request to be send, called as method
		enctype: 'multipart/form-data',
		async: false,
		contentType: false,			// The content type used when sending data to the server.
		cache: false,				// To unable request pages to be cached
		processData:false,			// To send DOMDocument or non processed data file it is set to false
		success: function(data)		// A function to be called if request succeeds
		{
			rel = JSON.parse(data);


			$.each(rel, function(index, value){
				
				var a = parseInt(value[run_id_a]);
				var b = parseInt(value[run_id_b]);
				var c = parseInt(value.common);
				
				relevance[relevance.length] = [index, a, b, c/10];
			});
			
			var order = $('input:radio[name="order"]:checked').val();
			run_name = [run_id_a, run_id_b];
			lChart(run_name, 'relevance', relevance, order);
		}
	});
}

function getRunVal(id_collection, id_run, id_query, place, param){
	var doc_id = [];
	$.get("getData.php",
			{
				data : "run_values",
				id_user: id_user,
				id_run: id_run,
				id_query: id_query,
				id_collection: id_collection
			}
		) 
		.done(function(data, status){

			runValues = JSON.parse(data);
			
			console.log(runValues);
			
			var run_name = $collection.prop("runs")[id_run].run_name;
			var query_name = $collection.prop("runs")[id_run].value[param][id_query].q_name;
			$(".run_data ."+place).append("<b>RUN: </b>" + run_name + "; ");
			$(".run_data ."+place).append("<b>Query id: </b>"+query_name);
			
			$.each(runValues, function(index, value) {
				doc_arr = value.doc_id.split("/");
				doc_name = decodeURI($(doc_arr).get(-1));
				
				docClass = doc_name.replace(/[\*\^\'\!\(\)\[\]\{\}\,\.\:\%\@\!\#\$\&\`\ \"]/g, '');

				if  ( typeof (doc_id[doc_name]) === "undefined" ){
					doc_id[doc_name] = index;
				};
				
				if (value.relevant > 0){
					$(".run_data ."+place).append("<br/><span class='compareQrels relevant "+ docClass +"' id='"+ docClass +"'>" +doc_name+ 
						  							"</span>");
				}else{
					$(".run_data ."+place).append("<br/><span class='compareQrels "+ docClass +"' id='"+ docClass +"'>" +doc_name+ 
						  							"</span>");
				}
			});
		});
}

//==GET Trec_Eval FROM DB and plot graf of two run======================================================
function getTrec_eval(run_id_a, run_id_b, id_collection){
	$.ajax({
		url: 'getData.php?'+
				'data=compareTwoTrecEval'+
				'&id_user='+id_user+
				'&id_collection='+id_collection+
				'&run_id_a='+run_id_a+
				'&run_id_b='+run_id_b,			// Url to which the request is send
		type: "GET",				// Type of request to be send, called as method
		enctype: 'multipart/form-data',
		async: false,
		contentType: false,			// The content type used when sending data to the server.
		cache: false,				// To unable request pages to be cached
		processData:false,			// To send DOMDocument or non processed data file it is set to false
		success: function(data)		// A function to be called if request succeeds
		{
			var trec_eval = JSON.parse(data);
			
			$.extend( true, $collection.prop("runs"), trec_eval );
		}
	});
}

function setParam(){
	$("#trec_eval_param").empty();
	
	var run_id_a = $collection.prop("compare").a;
	
	var trec_eval_a = $collection.prop("runs")[run_id_a].value;
	
	$.each(trec_eval_a, function(param, value){
		if(param != 'runid'){
			$("#trec_eval_param").append("<option value='"+param+"' >"+param+"</option>");
		}
	});
	
	$("#trec_eval_param").append("<option value='runs_relevance' >runs relevance</option>");
}

function setNL(){
	
	var run_id_a = $collection.prop("compare").a;
	var run_id_b = $collection.prop("compare").b;
	
	var NL = "";
	var map_a = $collection.prop("runs")[run_id_a].value.all.Mean_Average_Precision.value;
	var map_b = $collection.prop("runs")[run_id_b].value.all.Mean_Average_Precision.value;
	
	var recall_a = $collection.prop("runs")[run_id_a].value.all.num_rel_ret.value/$collection.prop("runs")[run_id_a].value.all.num_rel.value;
	var recall_b = $collection.prop("runs")[run_id_b].value.all.num_rel_ret.value/$collection.prop("runs")[run_id_b].value.all.num_rel.value;
	
	var rr_a = $collection.prop("runs")[run_id_a].value.all.recip_rank.value;
	var rr_b = $collection.prop("runs")[run_id_b].value.all.recip_rank.value;
	
	
	$("#nl_abs_a").text($(".runs a#"+run_id_a).attr('title'));
	$("#nl_abs_b").text($(".runs a#"+run_id_b).attr('title'));
	
	if(map_a > map_b){
		NL += "Comparatively, Method "+$collection.prop("runs")[run_id_a].run_name+" has a higher quality of returned results than Method "+$collection.prop("runs")[run_id_b].run_name+". ";
	}else{
		NL += "Comparatively, Method "+$collection.prop("runs")[run_id_a].run_name+" has a lower quality of returned results than method "+$collection.prop("runs")[run_id_a].run_name+".  ";
	}
	
	if(recall_a > recall_b){
		NL += "Furthermore, Method "+$collection.prop("runs")[run_id_a].run_name+" returns more relevant documents. ";
	}else{
		NL += "Furthermore, Method "+$collection.prop("runs")[run_id_a].run_name+" returns less relevant documents. ";
	}
	
	if(rr_a > rr_b){
		NL += "Finally, Method "+$collection.prop("runs")[run_id_a].run_name+"’s highest ranking results is of a higher quality. ";
	}else{
		NL += "Finally, Method "+$collection.prop("runs")[run_id_a].run_name+"’s highest ranking result is of a lower quality. ";
	}
	
	$("#nl_text").text(NL);
	$(".naturalLG").show();
}

function lChart(run_name, param, data_tail, order){
	
	data_tail.sort(function(a, b){return b[order]-a[order];});
	
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'ID');
	data.addColumn('number', run_name[0]);
	data.addColumn('number', run_name[1]);
	data.addColumn('number', 'overlap');
	
	data.addRows(data_tail);
	
	var options = {
			title: param,
			curveType: 'none',
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
		
		if (selectedItem) {
			var id_query;
			if (order == 4){
				var cal = selectedItem.column;
				var row = data.getValue(selectedItem.row, 0);
				id_query = v[cal][row].query_id;
				
			}else{
				id_query = data.getValue(selectedItem.row, 0);
			}

			var ids = ["a", "b"];
			var i = 0;
			var a = $collection.prop("compare").a;
	    	var b = $collection.prop("compare").b;
	    	
	    	var trec_eval = [$collection.prop("runs")[a], $collection.prop("runs")[b]];
	    	
			$.each(trec_eval, function(id_run, value){
				getRunVal($collection.prop("id"), id_run, id_query, ids[i]);
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

function setNLG_(id){

	var run_id = id;
	
	var avrMAP = getAVRparam(run_id, 'Mean_Average_Precision');
	
	var avrRecal = getAVRparam(run_id, 'recall');
	var result;
	if (avrMAP['id'] < avrMAP['avrColl']){
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

function overview(collection_id){
	
	$.get("getData.php", {data : "overview", id_user : "1", id_collection : collection_id}, 
		function(data, status){

			var collection = JSON.parse(data);

			if (typeof collection['error'] == "Undefined" || !collection['error']) {
				$("#overview").empty();
				$("#overview").append('<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true"></div>');
				var i = 0;
				$.each(collection, function( run_id, value ) {
					var run_name = value.run_name;
					var text = run_name + " " + setNLG_(run_id) + "</br></br>";
					
					$.each(value.run_values, function( param, val ) {
						text += param + " = " + val + "</br>";
					});
					if (i>0){
						collapsed = "collapsed";
						aria_expanded="false";
						in_ = "";
					}else{
						collapsed = "";
						aria_expanded="true";
						in_ = " in";
					}
					
					$("#accordion").prepend(
						'<div class="panel panel-default">'+
							'<div class="panel-heading" role="tab" id="heading'+run_id+'">'+
								'<h4 class="panel-title">'+
									'<a class="'+collapsed+'" data-toggle="collapse" data-parent="#accordion" href="#collapse'+run_id+'" aria-expanded="'+aria_expanded+'" aria-controls="collapse'+run_id+'">'+
										run_name+
									'</a>'+
								'</h4>'+
							'</div>'+
							'<div id="collapse'+run_id+'" class="panel-collapse collapse '+ in_+'" role="tabpanel" aria-labelledby="heading'+run_id+'">'+
								'<div class="panel-body">'+
									text+
								'</div>'+
							'</div>'+
						'</div>'
					);
					i++; 
				});
				
			}else{
				console.log("Error============="+data);
			}
		}
	);
}

function drawLineChart(data, param, order, nCall){

	var data_tail = [];
	var data_not_ordered = [];
	var v = [];
		v[1] = [];
		v[2] = [];
		v[3] = [];
	var v_a = [];
	
	var plotData = new google.visualization.DataTable();
	plotData.addColumn('string', 'ID');
	plotData.addColumn('number', data.a.run_name);
	plotData.addColumn('number', data.b.run_name);
	
	switch (param) {
		case "all":
			$("span#run_name_a").text(data.a.run_name);
			$("span#run_name_b").text(data.b.run_name);
			$("span#run_name_d").text("Diff(" + data.a.run_name + " - " + data.b.run_name + ")");
			
			if (nCall == 3){
				plotData.addColumn('number', 'Diff');
			}
			
			var i = 0;
			$.each(data, function(run_id, trec_eval){
				$.each(trec_eval['value'][param], function(query_id, val){
					if ( parseFloat(val['value'])<2 ){
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
					}
				});
				i++;
			});
			break;
		case "runs_relevance":
			data_tail.sort(function(a, b){return b[order]-a[order];});
			
			if (nCall == 3){
				plotData.addColumn('number', 'Diff');
			}
			
			plotData.addRows(data_tail);

			
			break;
		default:

			$("span#run_name_a").text(data.a.run_name);
			$("span#run_name_b").text(data.b.run_name);
			$("span#run_name_d").text("Diff(" + data.a.run_name + " - " + data.b.run_name + ")");
			
			if (nCall == 3){
				plotData.addColumn('number', 'Diff');
			}
			
			var i = 0;
			$.each(data, function(run_id, trec_eval){
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

			break;
	}
	
//	ordering of data ====================================================================
	if (order == 4){
		v[1].sort(function(a, b){return b.value-a.value;});
		v[2].sort(function(a, b){return b.value-a.value;});
		v[3].sort(function(a, b){return b.value-a.value;});
		
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
//========================================================================================	
	plotData.addRows(data_tail);
	
	var documentWidth = $(document).width(); //retrieve current document width
	var documentHeight = $(document).height(); //retrieve current document height
	console.log(documentWidth);
	var options = {
			title: param,
			curveType: 'none',
			legend: { position: 'bottom' },
			height: documentHeight/1.5,
			width: documentWidth,
			explorer: {maxZoomIn: .01} ,
			lineWidth: 1,
			chartArea: {left:50,top:40,width:'90%'},

		};

	var chart = new google.visualization.LineChart(document.getElementById("plot"));
	
	chart.draw(plotData, options);

//=============================================================================
	
	google.visualization.events.addListener(chart, 'select', selectHandler);
	
	function selectHandler() {

		$(".run_data .a").empty();
		$(".run_data .b").empty();
		
		var selectedItem = chart.getSelection()[0];
		
		if (selectedItem) {
			var id_query;
			if (order == 4){
				var cal = selectedItem.column;
				var row = plotData.getValue(selectedItem.row, 0);
				id_query = v[cal][row].query_id;
				
			}else{
				id_query = plotData.getValue(selectedItem.row, 0);
			}

			var run_id_a = $collection.prop("compare").a;
	    	var run_id_b = $collection.prop("compare").b;

			getRunVal($collection.prop("id"), run_id_a, id_query, "a", param);
			getRunVal($collection.prop("id"), run_id_b, id_query, "b", param);

			$(".run_data").show();
		}
	}
	
}
