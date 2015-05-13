<?php
class Trec_eval{
	private $db;
	private $id_user;
	private $id_run;
	/*
	 * Cerate Qrels Object
	* $conn - is an linc to db
	* $collection - Collection object
	* $file_qrels - is an array of type $_FILES['file-name']
	*/
	public function __construct(mysqli $conn, $id_user, $id_run) {
		$this->db = $conn;
		$this->id_user = $id_user;

		$this->id_run = $id_run;
		
		return $this;
	}

	public function setTrecEvalFromFile(Query $query, array $qrel_file, array $runs_file, $separator="\t") {
		
		$qrelCheck = isset( $qrel_file['name']) && isset($qrel_file['tmp_name']) &&  empty($qrel_file['error']);
		$runsCheck = isset( $runs_file['name']) && isset($runs_file['tmp_name']) &&  empty($runs_file['error']);
		
		if ($qrelCheck && $runsCheck){
			
			$file_qrel = $qrel_file['tmp_name'];
			$file_runs = $runs_file['tmp_name'];
			
			$ls = exec("./trec/bin/trec_eval -q $file_qrel $file_runs", $trec_eval, $ret_val);
	
			$mySQL_query = '';
			$i = 0;
			
			$mySQL_query_head = "INSERT INTO trec_eval (".
					"id_run, ".
					"id_query, ".
					"name, ".
					"value) VALUES ";
			
			if (empty($trec_eval)){
				throw new Exception("Not posible to get trec_eval " .PHP_EOL);			
			}
			
			$queries = $query->getQueries();
			
			foreach ($trec_eval as $row){
	
				$row_arr = explode($separator, $row);
				/*
				 * The `trec_eval` result contains one value per line,
				 *  where each line has three tab-separated fields: #value_name , #id_query and #value
				 */
				
				$id_query	 = $this->db->real_escape_string(full_trim($row_arr[1]));
				$value_name	 = $this->db->real_escape_string(full_trim($row_arr[0]));
				$value_name == 'map' ? $value_name = 'Mean_Average_Precision': 1;
				$value		 = $this->db->real_escape_string(full_trim($row_arr[2]));
				
				if ( isset($queries[$id_query]) ){
					$id_query = $queries[$id_query]['id'];
				}else{
					throw new Exception("Wrong data returnd from TREC_EVAL. There is no ID_QUERY=". $id_query .
							" in the QUERIES file");
				}
	
				if ( $i==0 ){ 
				
					$mySQL_query_tail = "( ".
										"'$this->id_run', ". 
										"'$id_query', ". 
										"'$value_name', ".
										"'$value') ";
					
					$i++;
				}else{
					if ($i < 999 ){
						$mySQL_query_tail .= ", ( ".
											"'$this->id_run', ". 
											"'$id_query', ". 
											"'$value_name', ".
											"'$value') ";
						$i++;
					}else{
						$mySQL_query_tail .= ", ( ".
											"'$this->id_run', ".
											"'$id_query', ".
											"'$value_name', ".
											"'$value') ";
						
						$mySQL_query = $mySQL_query_head . $mySQL_query_tail . ";" ;
						if ($this->db->query($mySQL_query) === TRUE) {
							$mySQL_query = '';
							$mySQL_query_tail = '';
							$i = 0;
						} else {
							throw new Exception("Not posible to add new trec_eval to DB" .PHP_EOL. $this->db->error);
							return false;
						}
					}
				}
				
			}
			
			if ( !empty($mySQL_query_tail) ){
				$mySQL_query = $mySQL_query_head . $mySQL_query_tail . ";" ;
				if ($this->db->query($mySQL_query) === TRUE) {
					$mySQL_query = '';
					$mySQL_query_tail = '';
				} else {
					throw new Exception("Not posible to add new trec_eval to DB" .PHP_EOL. $this->db->error);
					return false;
				}
			}
		}
		
	}

	public function getTrecEval(){
		$id_run = $this->db->real_escape_string($this->id_run);
		$id_user = $this->db->real_escape_string($this->id_user);
	
		$query = "SELECT t.id_query, q.id_query as q_name, t.name AS param, t.value, r.name AS run_name ". 
					"FROM trec_eval AS t ".
					"INNER JOIN runs AS r ".
						"ON t.id_run = r.id_run ".
					"INNER JOIN queries AS q ".
						"ON t.id_query = q.id ".
					"WHERE t.id_run = '$id_run';";
		
		if($result = $this->db->query($query)){
		
			if ($result->num_rows > 0) {
		
				while ($row = $result->fetch_assoc()) {
					
					$id_query = $row['id_query'];
					$q_name = $row['q_name'];
					$param =  $row['param'];
					$value =  $row['value'];
					$run_name =  $row['run_name'];

					$trec_eval['run_name'] = $run_name;
					
					if ( $q_name != "all" ){
						$trec_eval['value'][$param][$id_query]['value'] = $value;
						$trec_eval['value'][$param][$id_query]['name'] = $q_name;
					}else{
						$trec_eval['value']["all"][$param]['value'] = $value;
						$trec_eval['value']["all"][$param]['name'] = $q_name;
					}
				}
				
				return $trec_eval;
				
			} else {
				return false;
			}

		}else{
			throw new Exception("Can not take data from DB");
		}
	}

	public function getAVG($parameter, $collection=null){
		$id_run = $this->db->real_escape_string($this->id_run);
		$id_user = $this->db->real_escape_string($this->id_user);
		
		$query = "SELECT AVG(T.value) AS avg FROM trec_eval AS T ".
					"INNER JOIN runs AS R ".
						"ON T.id_run = R.id_run ".
					"INNER JOIN queries AS Q ".
						"ON T.id_query = Q.id ".
					"WHERE T.name = '$parameter' ".
						"AND  Q.id_query = 'all'";

		if (!empty($collection)){
			$query .= "AND R.id_collection = '$collection'";
		}
		
		if($result = $this->db->query($query)){
		
			if ($result->num_rows > 0) {
		
				$row = $result->fetch_assoc();

				$avr = $row['avg'];
		
				return $avr;
		
			} else {
				return false;
			}
		}
	}
	
	public function getTrecValue($parameter, $run, $collection=null){
		$id_run = $this->db->real_escape_string($this->id_run);
		$id_user = $this->db->real_escape_string($this->id_user);
		
		$query = "SELECT value FROM trec_eval AS T ".
					"INNER JOIN queries AS Q ".
						"ON T.id_query = Q.id ".
					"WHERE  T.id_run = '$run' ".
						"AND T.name = '$parameter' ". 
						"AND  Q.id_query = 'all'";

		if (!empty($collection)){
			$query .= "AND id_collection = '$collection'";
		};
		
		if($result = $this->db->query($query)){
		
			if ($result->num_rows > 0) {
		
				$row = $result->fetch_assoc();
		
				$val = $row['value'];
		
				return $val;
		
			} else {
				return false;
			}
		}
		
	}
	
	public function getRecall($run){
		
		$num_rel = $this->getTrecValue('num_rel', $run);
		$num_rel_ret = $this->getTrecValue('num_rel_ret', $run);
		
		if (empty($num_rel)){
			return 0;
		}else{
			return $num_rel_ret/$num_rel;
		}
		
	}
	
	public function getAVRrecall($collection=null){

		$num_rel = $this->getAVG("num_rel", $collection);
		$num_rel_ret = $this->getAVG("num_rel_ret", $collection);
		
		if (empty($num_rel)){
			return 0;
		}
		return $num_rel_ret/$num_rel;
		
	}
}
?>