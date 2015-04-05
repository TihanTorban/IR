<?php

class db{
	private $conn;
	private $host = "localhost";
	private $user = "ir_user";
	private $password = "1qaz";
	private $db_name = "ir";
	
	public function __construct() {
		$conn = new mysqli($this->host, $this->user, $this->password, $this->db_name);
		if ($conn->connect_error) {
			throw new Exception("Connection failed: " . $conn->connect_error);
		}
		$this->conn = $conn;
	}
	
	public function __construct1($host, $user, $password, $db_name) {
		$conn = new mysqli($host, $user, $password, $db_name);
		if ($conn->connect_error) {
			throw new Exception("Connection failed: " . $conn->connect_error);
		}
		$this->conn = $conn;
	}
	
	function __destruct(){
		$this->conn->close();
	}
}
/* // Create connection
$conn = new mysqli(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB);
// Check connection
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}


function insert($table, $headers, $value){
	global $conn;
	$sql = 	"INSERT INTO $table ($headers)".
			"VALUES ('$value')";
	
	if ($conn->query($sql) === TRUE) {
		return true;
	} else {
		return $conn->error;
	}
}

function select($table, $headers = '*', $condition){
	global $conn
	$query = "SELECT $headers FROM $table";
	$result = $conn->query($query);
	
	if ($result->num_rows > 0) {
		print_r($result);
		while($row = $result->fetch_assoc()) {
			print_r($row);
		}
	} else {
		return "0 results";
	}
} */

// $conn->close();


?>