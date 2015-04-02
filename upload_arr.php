<?php
require("inc/config.inc.php");
require("inc/functions.php");

testPrint($_FILES);

if ( 	isset($_FILES['file-queries']) && 
		isset($_FILES['file-qrels']) && 
		(	isset($_FILES['file-runs']) || 
			isset($_FILES['file-runs-0'])
		) 
	)
{
	// get QUERIES
	if ( isset($_FILES['file-queries']) ){
		$queries = getQueries($_FILES['file-queries']['tmp_name'], $_FILES['file-queries']['name']);
		if (is_array($queries)){
// 			testPrint($queries);								//return
		}else{
			$err_mesage[] = $queries;
		}
	}else{
		$err_mesage[] = 'No "Queries" file in the set.';
	}
		
	// get QRELS
	if ( isset($_FILES['file-qrels']) ){
		$qrels = getQrels($_FILES['file-qrels']['tmp_name'], $_FILES['file-qrels']['name']);
		if (is_array($qrels)){
// 			testPrint($qrels);									//return
		}else{
			$err_mesage[] = $qrels;
		}
	}else{
		$err_mesage[] = 'No "QRELS" file in the set.';
	}
	
	// get RUNs
	if ( isset($_FILES['file-runs']) ){				//files are load directe thru the form
		for ($i=0; $i<count($_FILES['file-runs']['name']); $i++){
			$runs = getRuns($_FILES['file-runs']['tmp_name'][$i], $_FILES['file-runs']['name'][$i]);
			if (is_array($runs)){
				testPrint($runs);									//return
			}else{
				$err_mesage[] = $runs;
			}
		}
	}elseif ( isset($_FILES['file-runs-0']) ){		//files are load thru the AJAX
		$j = 0;
		for ($i=0; $i<count($_FILES); $i++){
			$keys =  array_keys($_FILES);
			if ($keys[$i]!=='file-queries' & $keys[$i]!=='file-qrels'){
				$runs = getRuns($_FILES["file-runs-$j"]['tmp_name'], $_FILES["file-runs-$j"]['name']);
				if (is_array($runs)){
					testPrint($runs);									//return
				}else{
					$err_mesage[] = $runs;
				}
				$j++;
			}
		}
	}else{
		$err_mesage[] = 'No "RUNs" file in the set.';
	}
	
}else{
	$err_mesage[] = 'Some files are missing in the set.';
}

if (isset($err_mesage)){	
	testPrint($err_mesage);
}



function getQueries($file, $fileName){
	/* 	The `queries.txt` file contains one query per line,
	 where each line has two tab-separated fields: #queryID and #query_text.
	*/
	$headers_query = array("QUERY_ID", "TEXT");  	//query file

	$queries = txtToAssocArr($file, "\t", 0, $headers_query);

	if (!$queries){
		$err_mesage = 'Wrong format of a QUERIES file: '. $fileName.
		'. The file should contains one query per line, '.
		'where each line has two tab-separated fields: #queryID and #query_text.';
	}
	
	if (isset($err_mesage)){
		return $err_mesage;
	}else{
		return $queries;
	}
	
}

function getQrels($file, $fileName){
		/*	The format of a qrels file is as follows:
	
		    TOPIC      ITERATION      DOCUMENT#      RELEVANCY
		
		    where TOPIC is the topic number,
		    ITERATION is the feedback iteration (almost always zero and not used),
		    DOCUMENT# is the official document number that corresponds to the "docno" field in the documents, and
		    RELEVANCY is a binary code of 0 for not relevant and 1 for relevant.
    	*/
	
	$headers_qrels = array("QUERY_ID", "ITERATION", "DOCUMENT", "RELEVANCY");			//qrels file
	
	$qrels = txtToAssocArr($file, "\t", 0, $headers_qrels);

	if (!$qrels){
		$err_mesage = 'Wrong format of a QRELS file: '. $fileName .
		'. The format of a qrels file is as follows:'.
		'TOPIC &nbsp ITERATION &nbsp DOCUMENT# &nbsp RELEVANCY';
	}
	
	if (isset($err_mesage)){
		return $err_mesage;
	}else{
		return $qrels;
	}
	
}

function getRuns($file, $fileName){
		/*	
		* query-number   Q0   document   rank   score   Exp
		* 
		* 	where query-number is the number of the query, document-id is the external ID
		*	for the retrieved document, and score is the score that the retrieval system creates
		*	for that document against that query. Q0 (Q zero) and Exp are constants that are
		*	used by some evaluation software.
    	*/
	
	$headers_runs = array("QUERY_ID", "Q0", "DOCUMENT", "RANK", "SCORE", "Exp");	//runs file
	
	$qrels = txtToAssocArr($file, " ", 0, $headers_runs);

	if (!$qrels){
		$err_mesage = 'Wrong format of a RUNs file: '. $fileName .
		'. The format of a RUNs file is as follows:'.
		'. query-number &nbsp Q0 &nbsp document &nbsp rank &nbsp score &nbsp Exp';
	}
	
	if (isset($err_mesage)){
		return $err_mesage;
	}else{
		return $qrels;
	}
	
}

// function testPrint($arr){
// 	echo("<pre>");
// 	print_r($arr);
// 	echo("</pre>");
// }

?>