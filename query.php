<?php
class Query{
	private $db;
	private $id_user;
	private $collection;
	private $id_collection;
	
	/*
	 * 	The `queries.txt` file contains one query per line,
	*  where each line has two tab-separated fields: #queryID and #query_text.
	*/
	private $file_headers = array("id_query", "query_text");  	//query file

	private $queries;

	/*
	 * Cerate Query Object
	 * $conn - is an linc to db
	 * $collection - Collection object
	 * $file_queries - is an array of type $_FILES['file-name']
	 */
	public function __construct(mysqli $conn, $id_collection, $id_user) {

		$this->id_user = $id_user;
		$this->id_collection = $id_collection;
		$this->db = $conn;

		return $this;
	}
	
	private function getQueriesFromFileToArr($file, $fileName){
		
		/* 
		 * 	The `queries.txt` file contains one query per line,
		 *  where each line has two tab-separated fields: #queryID and #query_text.
		*/
		$file_headers = empty($file_headers) ? $this->headers_query : $file_headers;
		
		$queries = txtToAssocArr($file, "\t", 0, $file_headers);
	
		if (!$queries){
			throw new Exception("Wrong format of a QUERIES file: '$fileName'.".
					" The file should contains one query per line, ".
					"where each line has two tab-separated fields: #queryID and #query_text.");
		}
		
		$this->queries = $queries;
		
		return true;
	
	}
	
	public function setQueriesFromFile(array $file, $separator = "\t", array $file_headers=array()) {
		
		$file_headers = empty($file_headers) ? $this->file_headers : $file_headers;
		
		if ($file['error'] == 0){
			
			if (file_exists($file['tmp_name']) && is_readable($file['tmp_name'])) {
				$fh = fopen($file['tmp_name'], "r");
			
				// Processing
				if ($fh) {
					$i = 0;
					while (!feof($fh)) {
						$line = fgets($fh);
						if (!feof($fh)){
							$arr = explode($separator, $line);
							if (count($arr) == count($file_headers)){
									
								$query_id = $this->db->real_escape_string(full_trim($arr[0]));
								$query_text = $this->db->real_escape_string(full_trim($arr[1]));
								
								if (!is_array($this->id_collection)){
									$collection_id = $this->db->real_escape_string($this->id_collection);
								}
								
								if ($i == 0 ){
									$query = "INSERT INTO queries (id_query, id_collection, query_text)".
											"VALUES ('$query_id', '$collection_id', '$query_text')";
								}else{
									$query .= ", ('$query_id', '$collection_id', '$query_text')";
								}
									
								$i++;
			
							}else{
								fclose($fh);
								testPrint($arr);
								throw new Exception("Wrong format of a QUERIES file. ".
										" The file should contains one query per line, ".
										"where each line has two tab-separated fields: #queryID and #query_text.");
								return false;
							}
						}
			
					}
					// send query to MySQL
					if ($this->db->query($query) === TRUE) {
						if ($this->setQuery("all", "summarising") === TRUE) {
							return true;
						
						} else {
							throw new Exception("Not posible to add new QUERY to DB" .PHP_EOL. $query . PHP_EOL . $this->db->error);
							return false;
						}
						return true;
					} else {
						throw new Exception("Not posible to add new QUERY to DB" .PHP_EOL. $query . PHP_EOL . $this->db->error);
						return false;
					}
			
				}else{
					fclose($fh);
					throw new Exception("Not posible to opne file: ". $file['name']);
					return false;
				}
				fclose($fh);
				return true;
			}else{
				throw new Exception("file: ". $file['name']." not exists on server");
				return false;
			}
		}else{
			throw new Exception("File ".$file['name']." is corrupted");
		}
		
	}
	
	public function setQuery($query_id, $query_text){
		
		$query_id = $this->db->real_escape_string($query_id);
		$query_text = $this->db->real_escape_string($query_text);
		$collection_id = $this->db->real_escape_string($this->id_collection);
		
		$query = "INSERT INTO queries (id_query, id_collection, query_text)".
					"VALUES ('$query_id', '$collection_id', '$query_text')";
		
		if ($this->db->query($query) === TRUE) {
			return true;
		} else {
			throw new Exception("Not posible to add new QUERY to DB" .PHP_EOL. $query . PHP_EOL . $this->db->error);
		}
	}
	
/*
 * return assoc array $result[$query_id] = array(id=>$id, text=>$query_text);
 */
	public function getQueries(){
	
		if ( isset($this->querys) && !empty($this->querys) ){
			return $this->querys;
		}else{
		
			$collection_id = $this->db->real_escape_string($this->id_collection);
			
			$query = "SELECT * FROM queries WHERE id_collection = '$collection_id'";
			$result = $this->db->query($query);
			
			if ($result->num_rows > 0) {
				while ($row = $result->fetch_assoc()) {
					$id = $row['id'];
					$query_id = $row['id_query'];
					$query_text = $row['query_text'];
					$queries[$query_id] = array('id'=>$id, 'text'=>$query_text);
				}
			} else {
				return false;
			}
			$this->querys = $queries;
			return $queries;
		}
	}
	
	public function __toString(){
		return "Collection with ID=$this->collection_id and $this->query_id hawe QUERY=$this->query_text".PHP_EOL;
	}
	
}
?>