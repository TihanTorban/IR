var id_user = 1;
var relevance = [];

var natural_a = "is weak in finding relevant results, and the quality of the retrieved results is low. Therefore, this method is generally not recommended, unless specific reasons warrant its use.";
var natural_b = "is effective in retrieving relevant results, but generally the quality of the retrieved documents is low. Therefore, this method is acceptable for queries where it is desirable to find as many relevant documents as possible.";
var natural_c = "is weak in finding relevant results in the pool of data, but the returned results are generally of high quality. Therefore, this method is acceptable for queries where the quality of the retrieved documents is more important than the number of relevant documents retrieved.";
var natural_d = "is effective in finding relevant results, and the quality of the retrieved results is good. Therefore, this method is generally recommended for all type of searches.";


// Define a plain object
var collection_o = { id: "-1", name: "NaN" };
 
// Pass it to the jQuery function
var $collection = $( collection_o );

console.log($collection);

$collection.on( "changeCollection", function () {
	
	var collection_id = $("#collection_sett").val();
	var collection_name = $("#collection_sett option:selected").text();
	
	$(this).prop( "id", collection_id );
	$(this).prop( "name", collection_name );
	$(this).prop("compare", { a: -1, b: -1 });
	$(this).prop("absolut", {});
	
	$(".chart").hide();
	$("#plot").empty();
	
	$(".runs button.a>span.text").text("A: ");
	$(".runs button.a").val(-1);
	
	$(".runs button.b>span.text").text("B: ");
	$(".runs button.b").val(-1);
	
	if ( $(this).prop("id") != -1 ){
		$("#accordion").empty();
		$("#overviewChart").empty();
		
		getAbsolutCut('Mean_Average_Precision', false);
		getAbsolutCut('num_rel', false);
		getAbsolutCut('num_rel_ret', false);
		// get recall
		getAbsolutRecall();
		
		getRunsNames($(this).prop("id"), id_user);

		getRunsValues($(this).prop("id"));
		
		$(".runs_a_b").show();

	}else{
		$(".coll_sett").hide();
		$("#overview").empty();
	}
});

$collection.on( "compareToRuns", function () {
	
	var run_id_a = $(".runs button.a").val();
	var run_id_b = $(".runs button.b").val();
	
	if ( run_id_a > -1 && run_id_b > -1){
		
//		$(".nl").text("");
//		$(".naturalLG").hide();
		
		$(this).prop("compare", { a: run_id_a, b: run_id_b });
		
		$.each($(this).prop("compare"), function(id, value){
			if ( typeof $collection.prop('runs')[id] !== "undefined" && variable) {
				getRunValue(id, false);
			}
		});
		
		setParam();
	
		setNL_compare();
		
		var param = $("#trec_eval_param").val();
		var order = $('input:radio[name="order"]:checked').val();
		var plot_data = { a: $collection.prop("runs")[run_id_a], b: $collection.prop("runs")[run_id_b] };
		
		$(".order").children().prop('disabled',false);
		$(".chart_type").children().prop('disabled',true);
		drawLineChart(plot_data, param, order, 3);
		
		$('.chart').show();
		
	}
});

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
		var chartType = $('input:radio[name="chart_type"]:checked').val();
		
		var plot_data = [];
		switch (param){
			case "relevance":
				getCompareRunsRel();
				
				$(".chart_type").children().prop('disabled',false);
				
				switch (chartType) {
				
					case "line":
						$(".order").children().prop('disabled',false);
						drawLineChart(plot_data, param, order, 3);
						break;
						
					case "pie":
						$(".order").children().prop('disabled',true);
						drawPieChart('plot', param, "Relevance values");
						break;
				}
				break;
			case "all":
				$(".chart_type").children().prop('disabled',true);
				$(".order").children().prop('disabled',true);
				
				drawBarChart("plot", "all-compare", "All parameters");
				break;
			default:
				$(".order").children().prop('disabled',false);
				$(".chart_type").children().prop('disabled',true);
				drawLineChart(trec_eval, param, order, 3);
				break;
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
	
	$('input:radio[name="chart_type"]').change(function(){
		var param = $("#trec_eval_param").val();
		var order = $('input:radio[name="order"]:checked').val();
		
		switch ( $(this).val() ) {
		
			case "line":
				$(".order").children().prop('disabled',false);
				drawLineChart(plot_data, param, order, 3);
				break;
				
			case "pie":
				$(".order").children().prop('disabled',true);
				drawPieChart('plot', param, "Relevance values");
				break;
		}
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
function getRunsNames(id_collection, id_user){
	$.ajax({
		url: 'getData.php?data=runs_names&id_user='+id_user+'&id_collection='+id_collection,			// Url to which the request is send
		type: "GET",				// Type of request to be send, called as method
		enctype: 'multipart/form-data',
		async: false,
		contentType: false,			// The content type used when sending data to the server.
		cache: false,				// To unable request pages to be cached
		processData:false,			// To send DOMDocument or non processed data file it is set to false
		success: function(data)		// A function to be called if request succeeds
		{
			var runs = JSON.parse(data);
			
			if ( !(typeof data['error'] !== "undefined" && data['error'])) {
				
				$collection.prop("runs", runs);
				
				$('.runs ul').empty();
				
				$.each(runs, function( id_runs, value ) {
					
//					var nlg = setNLG_(id_runs);
					
					$('.runs ul.a').prepend(
						"<li role='presentation'>"+
							"<a role='menuitem' " +
								"tabindex='-1' " +
								"href='#' " +
								"data-toggle='tooltip' " +
								"class='run_item' " +
								"id='"+id_runs+"' >" + 
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
								"id='"+id_runs+"' >" + 
							value['run_name'] + 
							"</a>"+
						"</li>"
					);
				});
			}
		}
	});
}

//get relevances RUNs docs
function getRunRel(id_collection, run_id, sync){
	var get_data = 'data=getRunRel&id_user='+id_user+'&id_run='+run_id+'&id_collection='+id_collection; 
	$.ajax({
		url: 'getData.php?'+get_data,			// Url to which the request is send
		type: "GET",				// Type of request to be send, called as method
		enctype: 'multipart/form-data',
		async: sync,
		contentType: false,			// The content type used when sending data to the server.
		cache: false,				// To unable request pages to be cached
		processData:false,			// To send DOMDocument or non processed data file it is set to false
		success: function(data)		// A function to be called if request succeeds
		{
			rel = JSON.parse(data);
			$.extend( true, $collection.prop("runs"), rel );
		}
	});
}

//get relevance from RUNs A and B anr return common and exclusive relevance's
function getCompareRunsRel(){
	var collection_id = $collection.prop('id');
	var run_id_a = $collection.prop('compare').a;
	var run_id_b = $collection.prop('compare').b;
	
	if (run_id_a != -1 && run_id_b != -1){
		if (typeof $collection.prop('runs')[run_id_a].value.relevance == "Undefined" || 
					!$collection.prop('runs')[run_id_a].value.relevance) {
			getRunRel(id_collection, run_id_a, false);
		}
		if (typeof $collection.prop('runs')[run_id_b].value.relevance == "Undefined" || 
				!$collection.prop('runs')[run_id_b].value.relevance) {
			getRunRel(collection_id, run_id_b, false);
		}
		
		var a = $collection.prop('runs')[run_id_a].value.relevance;
		var b = $collection.prop('runs')[run_id_b].value.relevance;

		var result = {};
		
		$.each(a, function( id_query, value ) {
			result[id_query] = {common : 0, a : 0, b : 0};

			$.each(value.docs, function( doc, rel ) {
				if (typeof b[id_query] != "undefined" && b[id_query] !== null ){
					if ( typeof b[id_query].docs != "undefined" && b[id_query].docs !== null ){
						if ( typeof b[id_query].docs[doc] != "undefined" && b[id_query].docs[doc] !== null ){
							result[id_query].common++;
						}else{
							result[id_query].a++;
						}	
					}else{
						result[id_query].a++;
					}
				}else{
					result[id_query].a++;
				}
			});
		});
		
		$.each(b, function( id_query, value ) {
			if ( typeof result[id_query] == "undefined" || result[id_query] == null ){
				result[id_query] = {common : 0, a : 0, b : 0};
			}

			$.each(value.docs, function( doc, rel ) {
				if ( typeof a[id_query] != "undefined" && a[id_query] !== null ){
					if ( typeof a[id_query].docs[doc] == "undefined" || a[id_query].docs[doc] == null ) {
						result[id_query].b++;
					}
				}else{
					result[id_query].b++;
				}
			});
		});

	}
	
	$collection.prop('compare').relevance = result;
	
	return result;
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

			var runValues = JSON.parse(data);
			
//			console.log(data);
			
			var run_name = $collection.prop("runs")[id_run].run_name;
			var query_name = $collection.prop("runs")[id_run].value[param][id_query].name;
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

//	$('#trec_eval_param').val("relevance");

}

function setOverview(run_id){
	
	var run = $collection.prop('runs')[run_id];
	var run_name = run.run_name;
	var text_nl_absolut = run.nl.absolut;
	var text_param = "";
	$.each(run.value.all, function( param, val ) {
		text_param += param + " = " + val.value + "</br>";
	});
	
	$("#accordion").prepend(
			'<div class="panel panel-default">'+
				'<div class="panel-heading" role="tab" id="heading'+run_id+'">'+
					'<h4 class="panel-title">'+
						'<a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapse'+run_id+'" aria-expanded="false" aria-controls="collapse'+run_id+'">'+
							run_name+
						'</a>'+
					'</h4>'+
				'</div>'+
				'<div id="collapse'+run_id+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading'+run_id+'">'+
					'<div class="panel-body">'+
						'<div id="'+run_id+'" class="overview nl">'+text_nl_absolut+'</div>'+
						'</br>'+
						'<pre id="'+run_id+'" class="overview param">'+text_param+'</pre>'+
					'</div>'+
				'</div>'+
			'</div>'
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
	
	run_name_a = $collection.prop('runs')[$collection.prop('compare').a].run_name;
	run_name_b = $collection.prop('runs')[$collection.prop('compare').b].run_name;
	
	var plotData = new google.visualization.DataTable();
	plotData.addColumn('string', 'ID');
	plotData.addColumn('number', run_name_a);
	plotData.addColumn('number', run_name_b);
	
	switch (param) {
		case "all":
			$("span#run_name_a").text(data.a.run_name);
			$("span#run_name_b").text(data.b.run_name);
			$("span#run_name_d").text("Diff(" + data.a.run_name + " - " + data.b.run_name + ")");
			$(".radio_all").show();
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
		case "relevance":
			$("span#run_name_a").text(run_name_a);
			$("span#run_name_b").text(run_name_b);
			$("span#run_name_d").text("Overlap(" + run_name_a + " & " + run_name_b + ")");
			$(".radio_all").hide();
			
			var plot_data = [];
			
			$.each($collection.prop('compare').relevance, function(index, val){
				plot_data.push([String(index), val.a, val.b, val.common/10]);
			});
			
			data_not_ordered = plot_data;
			
			plotData.addColumn('number', 'Overlap x10');

			break;
		default:

			$("span#run_name_a").text(data.a.run_name);
			$("span#run_name_b").text(data.b.run_name);
			$("span#run_name_d").text("Diff(" + data.a.run_name + " - " + data.b.run_name + ")");
			$(".radio_all").show();
			
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
	
	var documentWidth = screen.width; //retrieve current document width
	var documentHeight = screen.height; //retrieve current document height
	
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
// 
function drawPieChart(target, param, title){
	var plotData = new google.visualization.DataTable();
	plotData.addColumn('string', 'ID');
	plotData.addColumn('number', 'Amount');
	plot_data = [];
	switch (param) {
		case "relevance":
			var run_name_a = $collection.prop('runs')[$collection.prop('compare').a].run_name;
			var run_name_b = $collection.prop('runs')[$collection.prop('compare').b].run_name;
			
			a = 0;
			b = 0;
			c = 0;
			
			$.each($collection.prop('compare').relevance, function(index, val){
				a += val.a;
				b += val.b;
				c += val.common;
			});
			
			plot_data = [[run_name_a, a], [run_name_b, b], ['Overlap', c]];
			break;
		case "all-relevance":
			$.each($collection.prop('runs'), function(index, val){
				plot_data.push([val.run_name, val.value.all.relevance.value]);
			});
			break;
	}
	
	plotData.addRows(plot_data);
	
	var options = {
	  title: title,
	  legend: {position: 'right'},
	  pieSliceText: 'label',
	  slices: {  1: {offset: 0.2},
	            2: {offset: 0.3}
	  },
	  is3D: true,
	  pieStartAngle: 50
    };

    var chart = new google.visualization.PieChart(document.getElementById(target));
    chart.draw(plotData, options);
	        
};

function drawBarChart(target, param, title){

	var runs_names = [];
	
	switch (param) {
		case "all-relevance":
			
			var runs_ids = [];
			var runs_value = [];
			$.each($collection.prop('runs'), function(key, value){
				runs_names.push(value.run_name);
				runs_ids.push(key);				
			});
			
			$.each(runs_names, function(key, value){
				var run_val = [];
				run_val.push( value );
				
				$.each(runs_names, function(i, v){
					if (v == value){
						run_val.push( $collection.prop('runs')[runs_ids[i]].value.all.relevance.value );
					}else{
						run_val.push( 0 );
					}					
				});
				run_val.push( '' );
				runs_value.push(run_val);
			});
			
			runs_names.unshift("RUN name");
			runs_names.push( { role: 'annotation' });
			
			runs_value.unshift(runs_names);
			
			plotData = runs_value;
			
			var options = {
					title : title,
			        width: 600,
			        height: 400,
			        legend: { position: 'right', maxLines: 3 },
			        bar: { groupWidth: '75%' },
			        isStacked: true
			      };
			
			break;
		case "all":
			
			var header = [];
			var tail = [];
			
			var runs = $collection.prop('runs');
			var run_params = runs[Object.keys(runs)[0]].value.all;
			
			$.each(runs, function(key, value){
				header.push(value.run_name);			
			});
			
			$.each(run_params, function(param, value){
				if (param != 'runid'){
					var elem = [];
					elem.push(param);
					
					$.each(runs, function(run_id, val){
						if (parseFloat(val.value.all[param].value)<2 ){
							elem.push( parseFloat(val.value.all[param].value) );
						}else{
							elem.push(null);
						}
					});
					
					elem.push('');
					
					tail.push(elem);
				}
			});
			header.push({ role: 'annotation' });
			
			header.unshift("RUN name");
			
			tail.unshift(header);
			
			plotData = tail;
			var documentWidth = screen.width; //retrieve current document width
			var documentHeight = screen.height; //retrieve current document height

			var options = {
					title : title,
					height: documentHeight/1.5,
					width: documentWidth,
			        legend: { position: 'bottom', maxLines: 3 },
			        chartArea: {left:50,top:40,width:'90%'},
			        bar: { groupWidth: '75%' },
			        isStacked: true
			      };
			
			break;
		case "all-compare":
			
			var header = [];
			var tail = [];
			
			var runs = $collection.prop('runs');
			var run_params = runs[$collection.prop('compare').a].value.all;
			
			$.each($collection.prop('compare'), function(key, value){
				header.push(runs[value].run_name);			
			});
			
			$.each(run_params, function(param, value){
				if (param != 'runid'){
					var elem = [];
					elem.push(param);
					
					$.each($collection.prop('compare'), function(id, run_id){
						var v = parseFloat($collection.prop('runs')[run_id].value.all[param].value);
						console.log(run_id);
						if ( v<2 ){
							elem.push( v );
						}else{
							elem.push(null);
						}
					});
					
					elem.push('');
					
					tail.push(elem);
				}
			});
			header.push({ role: 'annotation' });
			
			header.unshift("RUN name");
			
			tail.unshift(header);
			
			plotData = tail;
			
			console.log(tail);
			
			var documentWidth = screen.width; //retrieve current document width
			var documentHeight = screen.height; //retrieve current document height

			var options = {
					title : title,
					height: documentHeight/1.5,
					width: documentWidth,
			        legend: { position: 'bottom', maxLines: 3 },
			        chartArea: {left:50,top:40,width:'90%'},
			        bar: { groupWidth: '75%' },
			        isStacked: true
			      };
			
			break;
	}
	
	var plotData = google.visualization.arrayToDataTable(plotData);
	
	var chart = new google.visualization.ColumnChart(document.getElementById(target));
    chart.draw(plotData, options);
	        
};

function getRunsValues(){
	var collection_id = $("#collection_sett").val();
	$.each($collection.prop('runs'), function( run_id , value ) {
		getRunValue( run_id , false);
		getRunRel(collection_id, run_id, false);
	});
	
	getNL_collection();

	$("#overviewChart").append('<div id="overviewChart1"></div>');
	drawBarChart("overviewChart1", "all-relevance", "Total Relevance");
//	
	$("#overviewChart").append('<div id="overviewChart2"></div>');
	drawPieChart("overviewChart2", "all-relevance", "Total Relevance");
}

function getRunValue(run_id, sync){
	
	var id_collection = $collection.prop('id');
	
	$.ajax({
		url: 'getData.php?data=run_trec_val&id_user='+id_user+'&id_collection='+id_collection+'&id_run='+run_id,			// Url to which the request is send
		type: "GET",				// Type of request to be send, called as method
		enctype: 'multipart/form-data',
		async: sync,
		contentType: false,			// The content type used when sending data to the server.
		cache: false,				// To unable request pages to be cached
		processData:false,			// To send DOMDocument or non processed data file it is set to false
		success: function(data)		// A function to be called if request succeeds
		{
			runValues = JSON.parse(data);
			
			$collection.prop("runs")[run_id] = runValues[run_id];
			
			nl_absolut_text = getNL_absolut(run_id);
			
			$('.run_item#'+run_id).attr('title', nl_absolut_text);
			
			setOverview(run_id);
		}
	});
	
}

// NL=============================================================================

function getAbsolutCut( param , sync){
	var id_collection = $collection.prop('id');
	$.ajax({
		url: 'getData.php?data=absolutParamCut&param='+param+'&id_user='+id_user+'&id_collection='+id_collection,			// Url to which the request is send
		type: "GET",				// Type of request to be send, called as method
		enctype: 'multipart/form-data',
		async: sync,
		contentType: false,			// The content type used when sending data to the server.
		cache: false,				// To unable request pages to be cached
		processData:false,			// To send DOMDocument or non processed data file it is set to false
		success: function(data)		// A function to be called if request succeeds
		{
			absolut = JSON.parse(data);
			$.extend( true, $collection.prop('absolut'), absolut );

		}
	});
}

function getAbsolutRecall(){
	var recall = {recall:{}};
	if (typeof $collection.prop('absolut').num_rel.avg=="undefine" || 
		typeof $collection.prop('absolut').num_rel_ret.avg=="undefine"){
		console.log('upss');
	}else{
		$.each( $collection.prop('absolut').num_rel, function(key, value){
			if( value != 0){
				recall.recall[key] = $collection.prop('absolut').num_rel_ret[key]/value;
			}else{
				recall.recall[key] = 0;
			}
		} );
	}
	$.extend( true, $collection.prop('absolut'), recall );
};

//=========================================================
function getAVRparam(run_id, param){
	var id_collection = $collection.prop('id');
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

function getNL_absolut(run_id){
	var run = $collection.prop('runs')[run_id];
	var absolut = $collection.prop('absolut');
	
	var run_name = run.run_name;
	
	var run_map = run.value.all.Mean_Average_Precision.value;
	
	var run_num_rel_ret = run.value.all.num_rel_ret.value;
	var run_num_rel = run.value.all.num_rel.value;
	
	if (run_num_rel != 0){
		run_recall = run_num_rel_ret/run_num_rel;
	}else{
		run_recall = 0;
	}
	
	var map_min = absolut.Mean_Average_Precision.min;
	var map_max = absolut.Mean_Average_Precision.max;
	var map_avg = absolut.Mean_Average_Precision.avg;

	var min_avg_map = map_min + (map_avg - map_min)/2;
	var max_avg_map = map_avg + (map_max - map_avg)/2;
	
	var map_scale = false;
	
	switch(true) {
		case run_map >= map_min && run_map < min_avg_map:
//			alert(run_name+"/n min MAP ");
			map_scale = 'min';
		break;
		
		case run_map >= min_avg_map && run_map < max_avg_map:
//			alert(run_name+" medium MAP");
			map_scale = 'medium';
		break;
		
		case run_map >= max_avg_map && run_map <= map_max:
//			alert(run_name+" max MAP");
			map_scale = 'max';
		break;
		
		default:
			map_scale = '';
		break;
	}
	
	var recall_min = absolut.recall.min;
	var recall_max = absolut.recall.max;
	var recall_avg = absolut.recall.avg;
	
	var min_avg_recall = recall_min + (recall_avg - recall_min)/2;
	var max_avg_recall = recall_avg + (recall_max - recall_avg)/2;
	
	var nl_text = 'Compared to the average across all collections, ';
	
	switch(true){
		case run_recall >= recall_min && run_recall < min_avg_recall:
//			alert(run_name+" min RECALL");
			switch(map_scale){
			case 'min':
				nl_text += run_name +' is weak in finding relevant results, '+
					'and the returned results are of low quality. '+
					'Therefore, this method is generally not recommended.\n';
				break;
				
			case 'medium':
				nl_text +=  run_name +' is weak in finding relevant results, '+
						'and the returned results are of medium quality. '+
						'Therefore, this method could be acceptable where quality is important.\n';
				break;
				
			case 'max':
				nl_text +=  run_name +' is weak in finding relevant results, '+
						'but the returned results are of high quality. '+
						'Therefore, this method is excellent where only quality is important.\n';
				break;
				
			}
		break;
		
		case run_recall >= min_avg_recall && run_recall < max_avg_recall:
//			alert(run_name+" medium RECALL");
			switch(map_scale){
			case 'min':
				nl_text +=  run_name +' is mediocre in finding relevant results, '+
						'and the returned results are of low quality. '+
						'Therefore, this method could be acceptable where quantity is important.\n';
				break;
				
			case 'medium':
				nl_text +=  run_name +' is mediocre in finding relevant results, '+
						'and the returned results are of medium quality. '+
						'Therefore, this method could be acceptable where both quality and quantity is important.\n';
				break;
				
			case 'max':
				nl_text +=  run_name +' is mediocre in finding relevant results, '+
						'and the returned results are of high quality. '+
						'Therefore, this method is excellent where quality is important, '+
						'and acceptable where quantity is important.\n';
				break;
			
			}
		break;
		
		case run_recall >= max_avg_recall && run_recall <= recall_max:
//			alert(run_name+" max RECALL");
			switch(map_scale){
			case 'min':
				nl_text +=  run_name +' is strong in finding relevant results, '+
						'and the returned results are of low quality. '+
						'Therefore, this method could be excellent where only quantity is important.\n';
				break;
				
			case 'medium':
				nl_text +=  run_name +' is strong in finding relevant results, '+
						'and the returned results are of medium quality. '+
						'Therefore, this method could be acceptable where quality is important, '+
						'and excellent where quantity is important.';
				break;
				
			case 'max':
				nl_text +=  run_name +' is strong in finding relevant results, '+
						'and the returned results are of high quality. '+
						'Therefore, this method is generally recommended.\n';
				break;
				
			}
		break;
		
		default:
			console.log(run.run_name+" ERROR RECALL");
		break;
	}
	
	$.extend( true, run, {nl: {absolut: nl_text}} );

	return nl_text;
}

function getNL_collection(){
	orderedByMAP();
	orderedByRECALL();

	$.each($collection.prop('runs'), function(run_id, value){
		
		var nl_absolut = $collection.prop('runs')[run_id].nl.absolut;
		
		text = "Within the current collection "+value.run_name+" is ranked "+value.map_rank+" for MAP ("+
				value.value.all.Mean_Average_Precision.value+") and "+
				value.recall_rank+" for Recall ("+value.recall.toFixed(4)+").";
		
		$("#"+run_id+".nl").append(text);
		
		$.extend(true, $collection.prop('runs')[run_id].nl, {collection: nl_absolut+text});

	});
}

function orderedByMAP(){
	var runs_map = [];
	$.each($collection.prop('runs'), function(run_id, value){
		runs_map.push({run_id: run_id, 
						run_name: value.run_name, 
						Mean_Average_Precision: value.value.all.Mean_Average_Precision.value})
	});
	
	runs_map = runs_map.sort(function(a, b){
	    return b.Mean_Average_Precision-a.Mean_Average_Precision;
	});
	
	$.each(runs_map, function(key, value){
		switch(true){
		case key == 0:
			$.extend(true, $collection.prop('runs')[value.run_id], {map_rank: "first"});
			break;
		case key == 1:
			$.extend(true, $collection.prop('runs')[value.run_id], {map_rank: "2nd"});
			break;
		case key == 2:
			$.extend(true, $collection.prop('runs')[value.run_id], {map_rank: "3rd"});
			break;
		case key+1 == runs_map.length:
			$.extend(true, $collection.prop('runs')[value.run_id], {map_rank: "last"});
			break;
		default:
			$.extend(true, $collection.prop('runs')[value.run_id], {map_rank: key+"th"});
			break;
		}
	});
};

function orderedByRECALL(){
	var runs_recall = [];
	$.each($collection.prop('runs'), function(run_id, value){
		var recall = 0;
		if( value.value.all.num_rel.value != 0){
			recall = value.value.all.num_rel_ret.value/value.value.all.num_rel.value;
		}
		
		runs_recall.push({run_id: run_id, 
						run_name: value.run_name, 
						recall: recall});
	});
	
	runs_recall = runs_recall.sort(function(a, b){return b.recall-a.recall;});
	
	$.each(runs_recall, function(key, value){
		switch(true){
		case key == 0:
			$.extend(true, $collection.prop('runs')[value.run_id], {recall_rank: "first"});
			break;
		case key == 1:
			$.extend(true, $collection.prop('runs')[value.run_id], {recall_rank: "2nd"});
			break;
		case key == 2:
			$.extend(true, $collection.prop('runs')[value.run_id], {recall_rank: "3rd"});
			break;
		case key+1 == runs_recall.length:
			$.extend(true, $collection.prop('runs')[value.run_id], {recall_rank: "last"});
			break;
		default:
			$.extend(true, $collection.prop('runs')[value.run_id], {recall_rank: key+"th"});
			break;
		}

		$.extend(true, $collection.prop('runs')[value.run_id], {recall : value.recall});
	});
};

function setNL_compare(){
	
	var run_id_a = $collection.prop("compare").a;
	var run_id_b = $collection.prop("compare").b;

	var NL = "";
	
	var map_a = $collection.prop("runs")[run_id_a].value.all.Mean_Average_Precision.value;
	var map_b = $collection.prop("runs")[run_id_b].value.all.Mean_Average_Precision.value;
	
	var recall_a = $collection.prop("runs")[run_id_a].value.all.num_rel_ret.value/$collection.prop("runs")[run_id_a].value.all.num_rel.value;
	var recall_b = $collection.prop("runs")[run_id_b].value.all.num_rel_ret.value/$collection.prop("runs")[run_id_b].value.all.num_rel.value;
	
	var rr_a = $collection.prop("runs")[run_id_a].value.all.recip_rank.value;
	var rr_b = $collection.prop("runs")[run_id_b].value.all.recip_rank.value;
	
	
	$("#nl_abs_a").text($collection.prop("runs")[run_id_a].nl.collection);
	$("#nl_abs_b").text($collection.prop("runs")[run_id_b].nl.collection);
	
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

