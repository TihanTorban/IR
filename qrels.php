<?php
class Qrels{
	private $db;
	private $id_user;
	private $collection;
	
	/*	
	 * The format of a qrels file is as follows:
	 * 
	 * TOPIC      ITERATION      DOCUMENT#      RELEVANCY
	 *  where TOPIC is the topic number,
	 * ITERATION is the feedback iteration (almost always zero and not used),
	 * DOCUMENT# is the official document number that corresponds to the "docno" field in the documents, and
	 * RELEVANCY is a binary code of 0 for not relevant and 1 for relevant.
	 */
	private $file_headers = array("id_query", "ITERATION", "DOCUMENT", "RELEVANCY");
	
	private $file;
	private $qrels;

	
	/*
	 * Cerate Qrels Object
	 * $conn - is an linc to db
	 * $collection - Collection object
	 * $file_qrels - is an array of type $_FILES['file-name']
	*/
	public function __construct(Collection $collection, $id_user) {

		$this->id_user = $id_user;
		$this->collection = $collection;
		$this->db = $collection->getDBConnection();
	
		return $this;
	}
	
	public function setQrelsFromFile(array $file, $separator = "\t", array $file_headers=array()) {
		
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
								if (!is_array($this->collection->getId())){
									$id_collection 	= $this->db->real_escape_string($this->collection->getId());
								}
								
								$id_query 		= $this->db->real_escape_string(full_trim($arr[0]));
								$doc_id 		= $this->db->real_escape_string(full_trim($arr[2]));
								$relevant 		= $this->db->real_escape_string(intval(full_trim($arr[3])));
								
								if ($i == 0 ){
									$query = "INSERT INTO qrels (id_collection, id_query, doc_id, relevant)".
											"VALUES ('$id_collection', '$id_query', '$doc_id', '$relevant')";
								}else{
									$query .= ", ('$id_collection', '$id_query', '$doc_id', '$relevant')";
								}
									
								$i++;
	
							}else{
								fclose($fh);
								throw new Exception("Wrong format of a QRELS file. ".
										". The format of a qrels file is as follows:" .
										" ID_QUERY &nbsp ITERATION &nbsp DOCUMENT &nbsp RELEVANCY");
								return false;
							}
						}
		
					}
					// send query to MySQL
					if ($this->db->query($query) === TRUE) {
						return true;
					} else {
						throw new Exception("Not posible to add new QREL to DB" .PHP_EOL. $this->db->error);
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
	
// 	private function setQrelsFromFileToArr($file, $fileName){
// 		/*	The format of a qrels file is as follows:
		
// 		TOPIC      ITERATION      DOCUMENT#      RELEVANCY
		
// 		where TOPIC is the topic number,
// 		ITERATION is the feedback iteration (almost always zero and not used),
// 		DOCUMENT# is the official document number that corresponds to the "docno" field in the documents, and
// 		RELEVANCY is a binary code of 0 for not relevant and 1 for relevant.
// 		*/
		
// 		$headers_qrels = array("id_query", "ITERATION", "DOCUMENT", "RELEVANCY");			//qrels file
		
// 		$qrels = txtToAssocArr($file, "\t", 0, $headers_qrels);
		
// 		if (!$qrels){
// 			throw new Exception("Wrong format of a QRELS file: $fileName " .
// 					". The format of a qrels file is as follows:" .
// 					" ID_QUERY &nbsp ITERATION &nbsp DOCUMENT &nbsp RELEVANCY");
// 		}
		
// 		$this->qrels = $qrels;
		
// 		return true;
// 	}
	
	public function setQrel($id_query, $doc_id, $relevant){
		$id_collection 	= $this->db->real_escape_string($this->collection->getId());
		$id_query 		= $this->db->real_escape_string($id_query);
		$doc_id 		= $this->db->real_escape_string($doc_id);
		$relevant 		= $this->db->real_escape_string(intval($relevant));

		$query = "INSERT INTO qrels (id_collection, id_query, doc_id, relevant)".
					"VALUES ('$id_collection', '$id_query', '$doc_id', '$relevant')";
		
		if ($this->i<100){
			echo $query.PHP_EOL;
			$this->i++;
		}
		
		if ($this->db->query($query) === TRUE) {
			return true;
		} else {
			throw new Exception("Not posible to add new QREL to DB" .PHP_EOL. $query .PHP_EOL. $this->db->error);
			return false;
		}
	}
	
	public function getQrelByQueryId($query_id){
		$query = "SELECT * FROM queries WHERE id_query = '". $query_id ."' AND id_collection = '". $this->collection_id ."'";
		$result = $this->db->query($query);
	
		if ($result->num_rows > 0) {
			$row = $result->fetch_assoc();
			$this->query_id = $query_id;
			$this->query_text = $row['query'];
		} else {
			return false;
		}
		return $row;
	}
	
	public function __toString(){
		return "Collection with ID=$this->collection_id and $this->query_id hawe QUERY=$this->query_text".PHP_EOL;
	}
}
?>