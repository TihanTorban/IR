<?php
require("inc/config.inc.php");
require("inc/functions.php");
require("collection.php");
require("runs.php");
require("trec_eval.php");

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
							$result = $runs->getRunsByIdCollection($_GET["id_collection"]);
						}
					}else{
						error_msg("Not enough data".PHP_EOL);
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
							error_msg("Not enough data".PHP_EOL);
						}
					}
				
				} catch (Exception $e) {
					error_msg("Exception: {$e->getMessage()}".PHP_EOL);
				}
				break;
				
			case "run_trec_val":
				try {
					if ( isset($_GET["id_run"]) ){
						$trec_eval = new Trec_eval($mysql, $id_user, $_GET["id_run"]);
						
						$result[$_GET["id_run"]] = $trec_eval->getTrecEval();
						
					}else{
						error_msg("Not enough data".PHP_EOL);
					}
				} catch (Exception $e) {
					 error_msg("Exception: {$e->getMessage()}".PHP_EOL);
				}
				break;
				
			case "getRunRel":
			
				try {
					if ( isset($_GET["id_run"]) && !empty($id_collection) ) {
						$run = new Runs($mysql, $id_collection, $id_user);
						$run_id = $_GET["id_run"];
						$run_rel = $run->getRunRelValueById( $run_id );
						$result[$run_id] = $run_rel;
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
						
						$a = $run_a->getRunRelValueById( $a_id );
						$b = $run_b->getRunRelValueById( $b_id );
						
						
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
						error_msg("Not enough data".PHP_EOL);
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
						error_msg("Not enough data".PHP_EOL);
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
						error_msg("Not enough data".PHP_EOL);
					}
				} catch (Exception $e) {
					 error_msg("Exception: {$e->getMessage()}".PHP_EOL);
				}
					
				break;
				
			case "absolutParamCut":
				try {
					if ( isset($_GET["param"]) ){
						$param = $_GET["param"];
						
						$query = "SELECT AVG(T.value) AS avg, ".
										"MIN(T.value) AS min, ".
										"MAX(T.value) AS max ".
									"FROM trec_eval AS T ".
									"INNER JOIN queries AS Q ".
										"ON T.id_query = Q.id ".
									"WHERE T.name = '$param' ".
										"AND  Q.id_query = 'all' ";
						if($rslt = $mysql->query($query)){
						
							if ($rslt->num_rows > 0) {
								$row = $rslt->fetch_assoc();
								$result[$param]= $row;
							}else{
								error_msg("No data return".PHP_EOL);
							}
						}else{
							error_msg("Feil in query".PHP_EOL);
						}
					}else{
						error_msg("Not enough data".PHP_EOL);
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
		
		echo json_encode($result);
		
	}catch (Exception $e) {
		 error_msg("Exception: {$e->getMessage()}".PHP_EOL);
	}
}

?>