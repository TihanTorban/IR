<?php
// header("Content-type: text/plain");

require("inc/config.inc.php");
require("inc/functions.php");
require("collection.php");
require("query.php");
require("qrels.php");
require("runs.php");
require("trec_eval.php");

$headers_queries = array("id_query", "query_text");
$headers_qrels = array("id_query", "ITERATION", "DOCUMENT", "RELEVANCY");
$headers_runs = array("QUERY_ID", "Q0", "DOCUMENT", "RANK", "SCORE", "NAME");

try {
	$mysql = connectMySQL();
}catch (Exception $e){
	$result['error'] ="Exception: {$e->getMessage()}".PHP_EOL;
}

// testPrint($_FILES);
// testPrint($_POST);

$test = true;

if ( 	isset($_POST['id_user']) &&
		isset($_POST['collection_name']) &&
		isset($_FILES['file-queries']) &&
		isset($_FILES['file-qrels']) &&
		(	isset($_FILES['file-runs']) ||
			isset($_FILES['file-runs-0'])
		)
)
{
	
	
	check($_FILES['file-queries'], $headers_queries, "\t");
	check($_FILES['file-qrels'], $headers_qrels, "\t");
	
	if ( isset($_FILES['file-runs']) ){
		//-------------------------------------------------------------------------------------------
	}else {
		foreach ($_FILES as $key => $value){
			if (strpos($key, 'file-runs-') !== FALSE){
				check($_FILES[$key], $headers_runs, " ");
			}
		}
	}
	
	$id_user = !empty($_POST['id_user']) ? $_POST['id_user'] : error_msg("Unknown USER");
	
	// set COLLECTION name ==========================================================================

		$collectionName = full_trim($_POST['collection_name']);
		
		if ( !empty($collectionName) ){
			try {
				$collection = new Collection($mysql, $_POST['id_user']);
				if ( isset($collection) ){
					$collection->setCollection($collectionName);
				}else{
					error_msg("No 'Collection name' in the set.");
				}
			} catch (Exception $e) {
				error_msg("Exception: {$e->getMessage()}".PHP_EOL, $collection);
			}
		}else{
			error_msg("No 'Collection Name' in the set.");
		}

	
	// set QUERIES ==================================================================================

		if (isset($collection)){
			try {
				$queries = new Query($collection, $_POST['id_user']);
				isset($queries) ? $queries->setQueriesFromFile($_FILES['file-queries']) : $err_mesage[] = "Query not added";
			} catch (Exception $e) {
				error_msg("Exception: {$e->getMessage()}".PHP_EOL, $collection);
			}
		}else{
			error_msg("No 'Collection' in the set.");
		}


	// set QRELS ====================================================================================

		if (isset($queries)){
			try {
				$qrels = new Qrels($collection, $_POST['id_user']);
				isset($qrels) ? $qrels->setQrelsFromFile($_FILES['file-qrels']) : $err_mesage[] = "Qrels not added";
			} catch (Exception $e) {
				error_msg("Exception: {$e->getMessage()}".PHP_EOL, $collection);
			}
		}
	
	// get RUNs =====================================================================================
	if (isset($queries) && isset($qrels)){
		if ( isset($_FILES['file-runs']) ){				//files are load directe thru the form
			/* for ($i=0; $i<count($_FILES['file-runs']['name']); $i++){
				$runs = getRuns($_FILES['file-runs']['tmp_name'][$i], $_FILES['file-runs']['name'][$i]);
				if (is_array($runs)){
					try {
						$qrels = new Qrels($mysql, $collection, $_FILES['file-qrels']);
				
					} catch (Exception $e) {
						$err_mesage[] = "Exception: {$e->getMessage()}".PHP_EOL;
					}
				}else{
					$err_mesage[] = $runs;
				}
			} */
		}elseif ( isset($_FILES['file-runs-0']) ){		//files are load thru the AJAX
			foreach ($_FILES as $key => $value){
				if (strpos($key, 'file-runs-') !== FALSE){
					try {
						$id_collection = $collection->getId();
						$runs = new Runs($mysql, $id_collection , $id_user);
						$id_run = $runs->setRunsFromFile($_FILES[$key]);

						if ($id_run){
							$trec_eval = new Trec_eval($mysql, $id_user, $id_run);
							$trec_eval->setTrecEvalFromFile($_FILES['file-qrels'], $_FILES[$key]);
						}else{
							error_msg("Not posible to add new RUN to DB" .PHP_EOL, $collection);
						}
						
					} catch (Exception $e) {
						error_msg("Exception: {$e->getMessage()}".PHP_EOL, $collection);
					}
				}
			}

		}else{
			error_msg("No 'RUN' file(s) in the set.");
		}
	}
}else{
	error_msg("Some DATA are missing in the set.");
}

$mysql->close();

/*
 * check() file contents 
 * 
 *  $file - is an array of tye _FILES
 */
function check($file, $file_headers, $separator){
	if ($file['error'] == 0){
		if (file_exists($file['tmp_name']) && is_readable($file['tmp_name'])) {
			$fh = fopen($file['tmp_name'], "r");
			// Processing
			if ($fh) {	
				if (!feof($fh)){
					$line = fgets($fh);
					$arr = explode($separator, $line);
					if (count($arr) == count($file_headers)){
						return true;
					}else{
						error_msg("Wrong data format in the file: ". $file['name'] ." .", $collection);
					}
				}else{
					error_msg("Can not open file ".$file['name']." for reading.", $collection);
				}
			}
		}else{
			error_msg("Can not open file ".$file['name']." for reading", $collection);
		}
	}else{
		error_msg("File ".$file['name']." is corrupted", $collection);
	}
								
}

// function error_msg($text, $collection=NULL) {
	
// 	if (isset($collection)){
// 		try {
// 			$collection->deleteCollection();
// 		} catch (Exception $e) {
// 			$err_mesage['error'][] = "Exception: {$e->getMessage()}".PHP_EOL;
// 			$result = json_encode($err_mesage);
// 			die($result);
// 		}
	
// 	}
	
// 	$err_mesage['error'][] = $text;
// 	$result = json_encode($err_mesage);
// 	die($result);
// }


?>