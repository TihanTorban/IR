<?php

class Runs{
	private $db;
	private $id_collection;

	private $id_user;
	private $file_headers = array("QUERY_ID", "Q0", "DOCUMENT", "RANK", "SCORE", "NAME");
	
	private $id;
	private $name;
	private $privacy;
	
	private $collection;	
	private $runs;
	
	public function __construct(mysqli $conn, $id_collection, $id_user){
		$this->db = $conn;
		$this->id_user = $id_user;
		$this->id_collection = $id_collection;
		
		return $this;
	}
	
	public function getData(){
		return $this->runs;
	}
	
	public function getId(){
		return $this->id;
	}
	
	// get runs value from db by id_run
	public function getRunValueByIdQuery($id_run, $id_query, $limit=10){
		
		$id_user = $this->db->real_escape_string($this->id_user);
		$id_collection = $this->db->real_escape_string($this->id_collection);
	
		$query = "SELECT R.doc_id, Q.relevant, R.id ".
					"FROM results as R ".
						"LEFT JOIN qrels as Q ". 
						"ON R.doc_id = Q.doc_id ".
					"WHERE R.id_query='". $id_query ."' ".
						"AND R.id_run='". $id_run ."' ".
						"AND R.id_collection = '". $id_collection ."' ".
					"GROUP BY doc_id ".
					"ORDER BY rank;";

		if($result = $this->db->query($query)){
	
			if ($result->num_rows > 0) {
	
				while ($row = $result->fetch_assoc()) {
					$run_values[] = array(
											"doc_id" => $row["doc_id"],
											"id" => $row["id"],
											"relevant" => $row["relevant"]
										);
				}
	
			} else {
				return false;
			}
			return $run_values;
		}else{
			throw new Exception("Can not take data from DB");
		}

	}
	
	public function getRunRelValueById( $id_run ){
		
		$id_collection = $this->db->real_escape_string($this->id_collection);
		
		$query_r = "SELECT * FROM ir.results AS R ".
					"WHERE R.id_run='$id_run' ". 
						"AND R.id_collection=$id_collection";
		
		$query_q = "SELECT * FROM ir.qrels AS Q ".
					"WHERE Q.relevant>0 ".
						"AND Q.id_collection=$id_collection";
		
		if($result_q = $this->db->query($query_q)){
			if ($result_q->num_rows > 0) {
				while ($row_q = $result_q->fetch_assoc()) {
					$qrels[$row_q["id_query"]][$row_q["doc_id"]] = $row_q["relevant"] ;
				}
			} else {
				return false;
			}
		}else{
			throw new Exception("Can not take data from DB");
		}
		$total_count = 0;
		if($result_r = $this->db->query($query_r)){
			if ($result_r->num_rows > 0) {
				while ($row_r = $result_r->fetch_assoc()) {
					
					if ( isset( $qrels[ $row_r['id_query'] ][ $row_r['doc_id'] ]) ){
						if( !isset($run_relevant['value']['relevance'][ $row_r['id_query'] ]) ){
							$run_relevant['value']['relevance'][ $row_r["id_query"] ]['value'] = 0;
						}
						$total_count++;
						$run_relevant['value']['relevance'][ $row_r['id_query'] ]['value']++;
						$run_relevant['value']['relevance'][ $row_r['id_query'] ]['docs'][$row_r['doc_id']] = $qrels[ $row_r['id_query'] ][ $row_r['doc_id'] ] ;
					}
				}
				$run_relevant['value']['all']['relevance']['value'] = $total_count;
			} else {
				return false;
			}
			return $run_relevant;
		}else{
			throw new Exception("Can not take data from DB");
		}
	}
	
	// get runs from db by id_collection
	public function getRunsByIdCollection($id_collection){
		
		$id_user = $this->db->real_escape_string($this->id_user);
		$id_collection = $this->db->real_escape_string($id_collection);
	
		$query = "SELECT * FROM runs ".
				"WHERE id_collection = '$id_collection'".
				" AND (id_user = '$id_user' OR privacy = '0') ORDER BY name";

		if($result = $this->db->query($query)){
	
			if ($result->num_rows > 0) {
	
				while ($row = $result->fetch_assoc()) {
					$this->id[] = $row['id_collection'];
					$this->name[] = $row['name'];
					$this->privacy[] = $row['privacy'];
					
					$runs[$row['id_run']]['run_name'] = $row['name'];
					$runs[$row['id_run']]['privacy'] = $row['privacy'];
						
				}
	
			} else {
				return false;
			}
			return $runs;
		}else{
			throw new Exception("Can not take data from DB");
		}

	}
	
	private function isValid($id_run){
		
	}
	
	public function setRunsFromFile(Query $query, array $file, $separator = " ", array $file_headers=array()){
		
		if (isset( $file['name']) && isset($file['tmp_name']) &&  empty($file['error'])){
			
			$file_headers = empty($file_headers) ? $this->file_headers : $file_headers;
			
			$queries = $query->getQueries();
			
			if (file_exists($file['tmp_name']) && is_readable($file['tmp_name'])) {
				$fh = fopen($file['tmp_name'], "r");
			
				// Processing
				if ($fh) {
					$i = 0;
					$temp_name='';
					$secure = FALSE;
					
					while (!feof($fh)) {
						$line = fgets($fh);
						if (!feof($fh)){
							$arr = explode($separator, $line);
							if (count($arr) == count($file_headers)){
									
								$id_collection 	= $this->db->real_escape_string($this->id_collection);
								
								$run_name 		= $this->db->real_escape_string(full_trim($arr[5]));
								$id_query 		= $this->db->real_escape_string(full_trim($arr[0]));
								$doc_id 		= $this->db->real_escape_string(full_trim($arr[2]));
								$runk 			= $this->db->real_escape_string(intval(full_trim($arr[3])));
								$score 			= $this->db->real_escape_string(floatval(full_trim($arr[4])));

								if ( isset($queries[$id_query]) ){
									$id_query = $queries[$id_query]['id'];
								}else{
									fclose($fh);
									throw new Exception("Wrong data in a RUN file: ".$file['name'].". There is no ID_QUERY=". $id_query .
											" in the QUERIES file");
								}
								
								if ($i < 1000){
									if ($i == 0 ){
										
										if ($temp_name != $run_name ){
											if ($secure){
												throw new Exception("Not posible to have two different RUN name in one file");
											}
											$id_run = $this->setRun($run_name);
											$temp_name = $run_name;
											$secure = true;
										}
										
										if (!$id_run){
											throw new Exception("Not posible to add new RUN to DB");
										}
										
										$query = "INSERT INTO results (id_run, id_query, doc_id, rank, score, id_collection)".
												"VALUES ('$id_run', '$id_query', '$doc_id', '$runk', '$score', '$id_collection')";
										
									}else{
										$query .= ", ('$id_run', '$id_query', '$doc_id', '$runk', '$score', '$id_collection')";
									}
									
									$i++;
									
								}else{
									if ($this->db->query($query) === TRUE) {
										$query = "INSERT INTO results (id_run, id_query, doc_id, rank, score, id_collection)".
												"VALUES ('$id_run', '$id_query', '$doc_id', '$runk', '$score', '$id_collection')";
									} else {
										throw new Exception("Not posible to add new RUNs (result) to DB" .PHP_EOL. $this->db->error);
										return false;
									}
									
									$i = 1;
								}
			
							}else{
								fclose($fh);
								throw new Exception("Wrong format of a RUNs file: ". $file['name'] .
												". The format of a RUNs file is as follows:".
												". query-number &nbsp Q0 &nbsp document &nbsp rank &nbsp score &nbsp name");
								return false;
							}
						}
			
					}
					if(!empty($query)){
						if ($this->db->query($query) === TRUE) {
						
						} else {
							throw new Exception("Not posible to add new RUNs (result) to DB" .PHP_EOL. $this->db->error);
							return false;
						}
					}

				}else{
					fclose($fh);
					throw new Exception("Not posible to opne file: ". $file['name']);
					return false;
				}
				fclose($fh);
				return $id_run;
			}else{
				throw new Exception("file: ".$file['name']." not exists");
				return false;
			}
		}else{
			throw new Exception("File ".$file['name']." is corrupted");
		}
	}
	
	private function setRun($name){

		$id_collection 	= $this->db->real_escape_string($this->id_collection);
		$name 			= $this->db->real_escape_string($name);
		$id_user 		= $this->db->real_escape_string($this->id_user);
		
		$query = "INSERT INTO runs (id_collection, name, id_user)".
				"VALUES ('$id_collection', '$name', '$id_user')";
		
		if ($this->db->query($query) === TRUE) {
			$id_run = $this->db->insert_id;
			$this->id = $id_run;
			return $id_run;
		} else {
			throw new Exception("Not posible to add new RUN to DB" .PHP_EOL);
			return false;
		}
	}
	
	private function setRunResult($id_run, $id_query, $id_doc, $runk, $score){

		$id_run 	= $this->db->real_escape_string($id_run);
		$id_query 	= $this->db->real_escape_string($id_query);
		$id_doc 	= $this->db->real_escape_string($id_doc);
		$runk 		= $this->db->real_escape_string($runk);
		$score 		= $this->db->real_escape_string($score);
		
		$query = "INSERT INTO results (id_run, id_query, doc_id, rank, score)".
				"VALUES ('$id_run', '$id_query', '$id_doc', '$runk', '$score')";
		
		if ($this->db->query($query) === TRUE) {
			return true;
		} else {
			throw new Exception("Not posible to add new RunResults to DB" .PHP_EOL);
			return false;
		}
	}
}

?>