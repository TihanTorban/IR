<?php
class Collection{
	private $db;
	private $id;
	private $name;
	private $privacy;
	private $id_user;
	
	private $coll;
	
	/*
	 * create Collection Object
	 * 
	 * $conn - is an linc to db
	 * $collection - name of the new collection 
	 * or id of the exist in DB collection
	 */
	public function __construct(mysqli $conn, $id_user) {
		$this->db = $conn;
		$this->id_user = $id_user;
		
		$this->getCollectionsByUser($id_user);
		
		return $this;
	}
	
	public function getDBConnection(){
		return $this->db;
	}
	
	public function getId(){
		return $this->id;
	}
	
	public function getName(){
		return $this->name;
	}
	
	public function getPrivacy(){
		return $this->privacy;
	}
	
	public function getData(){
		return $this->coll;
	}
	
	public function getCollectionsPublic($id_user){
		$query = "SELECT * FROM test_collections WHERE privacy = '0' ORDER BY name";
		
		if($result = $this->db->query($query)){
				
			if ($result->num_rows > 0) {
		
				while ($row = $result->fetch_assoc()) {
					$this->id[] = $row['id_test_collections'];
					$this->name[] = $row['name'];
					$this->privacy[] = $row['privacy'];
				}
		
			} else {
				return false;
			}
			return true;
		}else{
			throw new Exception("Can not take data from DB");
		}
	}
	
	public function getCollectionsByUser($id_user){
		
		$id_user = $this->db->real_escape_string($id_user);
		
		$query = "SELECT * FROM test_collections WHERE id_user = '". $id_user ."' ORDER BY name";
		
		if($result = $this->db->query($query)){
			
			if ($result->num_rows > 0) {
				
				while ($row = $result->fetch_assoc()) {
					$this->id[] = $row['id_test_collections'];
					$this->name[] = $row['name'];
					$this->privacy[] = $row['privacy'];
					
					$this->coll[$row['id_test_collections']]['name'] = $row['name'];
					$this->coll[$row['id_test_collections']]['privacy'] = $row['privacy'];
					
				}
				
			} else {
				return false;
			}
			return true;
		}else{
			throw new Exception("Can not take data from DB");
		}
	}
	
	public function getCollection($id_collection){
		$id_user = $this->db->real_escape_string($id_user);
		
		$query = "SELECT * FROM test_collections ".
					"WHERE id_test_collections = '$id_collection',".
					" AND (id_user = '$id_user' OR privacy = '0') ORDER BY name";
		
		if($result = $this->db->query($query)){
				
			if ($result->num_rows > 0) {
		
				while ($row = $result->fetch_assoc()) {
					$this->id[] = $row['id_test_collections'];
					$this->name[] = $row['name'];
					$this->privacy[] = $row['privacy'];
				}
		
			} else {
				return false;
			}
			return true;
		}else{
			throw new Exception("Can not take data from DB");
		}

	} 
	
	public function setCollection($name){
		
		$name = $this->db->real_escape_string($name);
		$id_user = $this->db->real_escape_string(intval($this->id_user));
		
		$query = "INSERT INTO test_collections (name, id_user)".
					"VALUES ('$name', '$id_user')";

		if ($this->db->query($query) === TRUE) {
			$this->name = $name;
			$this->id = $this->db->insert_id;
			return true;
		} else {
			throw new Exception("Not posible to add new Collection to DB");
		}
	}
	
	public function deleteCollection( $id=NULL ){
		if ($id === NULL){
			$id = $this->db->real_escape_string($this->id);
		}else{
			$id = $this->db->real_escape_string($id);
		}
		if (is_array($id)){
			foreach ($id as $value){
				$query = "DELETE FROM test_collections WHERE id_test_collections = '$id'";
				
				if ($this->db->query($query) === TRUE) {
					return true;
				} else {
					throw new Exception("Not posible to DELETE Collection from DB. $query".PHP_EOL.$this->db->error);
				}
			}
		}else{
			$query = "DELETE FROM test_collections WHERE id_test_collections = '$id'";
			
			if ($this->db->query($query) === TRUE) {
				return true;
			} else {
				throw new Exception("Not posible to DELETE Collection from DB. $query".PHP_EOL.$this->db->error);
			}
		}
	}
	
	public function __toString(){
		return "Collection with ID=$this->id hawe NAME=$this->name".PHP_EOL;
	}
}

?>
