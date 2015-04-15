<?php
require("inc/config.inc.php");
require("inc/functions.php");
require("collection.php");
require("runs.php");
require("trec_eval.php");

// testPrint($_GET);

if (isset($_GET["data"]) && isset($_GET['id_user'])){
	
	$id_user = intval($_GET['id_user']);
	$id_collection = isset($_GET['id_collection']) ? $_GET['id_collection'] : false;
	
	try {
		$mysql = connectMySQL();
		
		switch($_GET["data"]){
			case "collections":
				try{
					$collection = new Collection($mysql, $id_user);
					
					if (isset($collection)){
						$result["collections"] = $collection->getData();

					}
				} catch (Exception $e) {
					 error_msg("Exception: {$e->getMessage()}".PHP_EOL);
				}
				break;
				
			case "runs_names":
				try {
					if ( !empty($id_collection) ){
						$runs = new Runs($mysql, $id_collection, $id_user);
						if (isset($runs)){
							$result["run_names"] = $runs->getRunsByIdCollection($_GET["id_collection"]);
						}
					}else{
						error_msg("Not inaf data".PHP_EOL);
					}

				} catch (Exception $e) {
					 error_msg("Exception: {$e->getMessage()}".PHP_EOL);
				}
					
				break;
				
			case "run_values":
				try {
					if ( !empty($id_collection) ){
						$run = new Runs($mysql, $id_collection, $id_user);
						if (isset($run) && isset($_GET["id_run"]) && isset($_GET["id_query"]) ){
							
							$id_run = $_GET["id_run"];
							$id_query = $_GET["id_query"];
							
							$result = $run->getRunValueByIdQuery($id_run, $id_query);
						}else{
							error_msg("Not inaf data".PHP_EOL);
						}
					}
				
				} catch (Exception $e) {
					error_msg("Exception: {$e->getMessage()}".PHP_EOL);
				}
				break;
				
			case "compareTwoRunRel":
				
				try {
					if ( isset($_GET["run_id_a"]) && isset($_GET["run_id_b"]) && !empty($id_collection) ) {
						$run_a = new Runs($mysql, $id_collection, $id_user);
						$run_b = new Runs($mysql, $id_collection, $id_user);
						
						$a_id = $_GET["run_id_a"];
						$b_id = $_GET["run_id_b"];
						
						$a = $run_a->getRunValueById( $a_id );
						$b = $run_b->getRunValueById( $b_id );
						
						
						foreach ($a as $key => $value){
							$result[$key] = array('common'=>0, $a_id=>0, $b_id=>0);
							foreach ($value as $k => $v){
								if ( isset( $b[$key][$k] ) ){
									$result[$key]['common']++;
								}else{
									$result[ $key ][ $a_id ]++;
								}
							}
						}
						
						foreach ($b as $key => $value){
							if ( !isset($result[$key]) ){
								$result[$key] = array('common'=>0, $a_id=>0, $b_id=>0);
							}
							foreach ($value as $k => $v){
								if ( !isset( $a[$key][$k] ) ){
									$result[$key][ $b_id ]++;
								}
							}
						}
					}else{
						error_msg("Not inaf data".PHP_EOL);
					}
				} catch (Exception $e) {
					error_msg("Exception: {$e->getMessage()}".PHP_EOL);
				}
				
				break;
				
			case "compareTwoTrecEval":
				try {
					if ( isset($_GET["run_id_a"]) && isset($_GET["run_id_b"]) ){
						$trec_eval_a = new Trec_eval($mysql, $id_user, $_GET["run_id_a"]);
						$trec_eval_b = new Trec_eval($mysql, $id_user, $_GET["run_id_b"]);
						
						$result[$_GET["run_id_a"]] = $trec_eval_a->getTrecEval();
						$result[$_GET["run_id_b"]] = $trec_eval_b->getTrecEval();
						
					}else{
						error_msg("Not inaf data".PHP_EOL);
					}
				} catch (Exception $e) {
					 error_msg("Exception: {$e->getMessage()}".PHP_EOL);
				}
				break;
				
			case "avgParam":
				try {
					if ( isset($_GET["param"]) && isset($_GET["id_run"]) && !empty($id_collection) ){
						$trec_eval = new Trec_eval($mysql, $id_user, -1);
						if ($_GET["param"] == 'recall'){
							$result['avrAll'] = $trec_eval->getAVRrecall();
							$result['avrColl'] = $trec_eval->getAVRrecall($id_collection);
							$result['id'] = $trec_eval->getRecall( $_GET["id_run"]);
						}else{
							$result['avrAll'] = $trec_eval->getAVG($_GET["param"]);
							$result['avrColl'] = $trec_eval->getAVG($_GET["param"], $id_collection);
							$result['id'] = $trec_eval->getTrecValue($_GET["param"], $_GET["id_run"]);
						}
					}else{
						error_msg("Not inaf data".PHP_EOL);
					}
				} catch (Exception $e) {
					 error_msg("Exception: {$e->getMessage()}".PHP_EOL);
				}
					
				break;
				
			default:
				$result = "";
				break;
		}
		$mysql->close();
		
// 		testPrint($result);
		
		echo json_encode($result);
		
	}catch (Exception $e) {
		 error_msg("Exception: {$e->getMessage()}".PHP_EOL);
	}
}




// print_r($result);

?>