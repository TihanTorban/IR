<?php
require("inc/config.inc.php");
require("inc/functions.php");

if ( isset($_GET["a"]) && isset($_GET["b"]) && isset($_GET["id"]) ){
	$a = $_GET["a"];
	$b = $_GET["b"];
	$id = $_GET["id"];

	$headers_runs = array("QUERIES_ID", "Q0", "DOCUMENT", "NUMBER", "M", "RUNs_NAME");	//RUNs file
	$headers_qrels = array("QRELS_ID", "ITERATION", "DOCUMENT", "RELEVANCY");			//QRELS file
	
	$arr_a = txtToAssocArr("./trec/run/$a", " ", 0, $headers_runs);
	$arr_b = txtToAssocArr("./trec/run/$b", " ", 0, $headers_runs);
	
	$arr_qrels = txtToAssocArr("./trec/qrels/qrels.txt", "\t", 0, $headers_qrels);

	foreach ($arr_a[$id]['DOCUMENT'] as $value){
		$relevant = relevant($id, $value, $arr_qrels);
		$arr_result_a[] = array($value, $relevant);
	}
	
	foreach ($arr_b[$id]['DOCUMENT'] as $value){
		$relevant = relevant($id, $value, $arr_qrels);
		$arr_result_b[] = array($value, $relevant);
	}

	$result = array("a" => getTop($arr_result_a, 10), "b" => getTop($arr_result_b, 10));
	
	echo json_encode($result); //return
	
}else{
	echo "";
}

function relevant($id, $result, $arr_qrels){
	
	if (isset($arr_qrels[$id])){
		foreach ($arr_qrels[$id]['DOCUMENT'] as $key => $value){
			
			if ($result == $value){
				if ($arr_qrels[$id]['RELEVANCY'][$key] == 1){
					return true;
				}
				return false;
			}
		}
	}
	
	return false;
}

function getTop($arr, $n){
	return array_slice($arr, 0, $n);
}
?>