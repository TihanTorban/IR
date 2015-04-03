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

	public function setTrecEvalFromFile(array $qrel_file, array $runs_file, $separator="\t") {
		
		$file_query = $qrel_file['tmp_name'];
		$file_runs = $runs_file['tmp_name'];
		
		$ls = exec("./trec/bin/trec_eval -q $file_query $file_runs", $trec_eval, $ret_val);

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

	public function getTrecEval(){
		$id_run = $this->db->real_escape_string($this->id_run);
		$id_user = $this->db->real_escape_string($this->id_user);
		
// 		$query = "SELECT id_query, name, value FROM trec_eval ".
// 					"WHERE id_run = '$id_run'";
		
		$query = "SELECT t.id_query, t.name AS param, t.value, r.name AS run_name ". 
					"FROM trec_eval AS t ".
					"INNER JOIN runs AS r ".
						"ON t.id_run = r.id_run ".
					"WHERE t.id_run = '$id_run';";
		
		if($result = $this->db->query($query)){
		
			if ($result->num_rows > 0) {
		
				while ($row = $result->fetch_assoc()) {
					
					$id_query = $row['id_query'];
					$param =  $row['param'];
					$value =  $row['value'];
					$run_name =  $row['run_name'];
					
					$trec_eval[$run_name][$id_query][$param] = $value;
						
				}
				
				return $trec_eval;
				
			} else {
				return false;
			}

		}else{
			throw new Exception("Can not take data from DB");
		}
	}

}
?>