<?php


/* 
 * Parse text to associative array
 * 
* $file - file address
* $separator - seporator
* $id - number of the field from $file, which should be an root key of the return array
* $headers - an array which inhold names for each of the fields
*
* return an associative array
* or FALSE if number of fields in the file mismatch with number of fields in $headers or
* if it is not possible to open the file
*/
function txtToAssocArr($file, $separator, $id, $headers) {
	if (file_exists($file) && is_readable($file)) {
		$fh = fopen($file, "r");

		// Processing
		if ($fh) {
				
			while (!feof($fh)) {
				$line = fgets($fh);
				if (!feof($fh)){
					$arr = explode($separator, $line);
					if (count($arr) == count($headers)){
						for ($i=0; $i<count($headers); $i++ ){
							if ($i != $id){
								$element = full_trim($arr[$i]);
								$assoc_arr[$arr[$id]][$headers[$i]][] = $element;
							}
						}
					}else{
						fclose($fh);
						return false;
					}
				}
			}
				
		}else{
			fclose($fh);
			return false;
		}
		fclose($fh);
		return $assoc_arr;
	}else{
		return false;
	}
}

// Erase all spaces in str.
function full_trim($str){
	return trim(preg_replace('/\s{2,}/', '', $str));
}

// Printe out error mesage in json format
function error_msg($text, Collection $collection=NULL) {

	if (isset($collection)){
		try {
			$collection->deleteCollection();
			$mysql->close();
		} catch (Exception $e) {
			$err_mesage['error'][] = "Exception: {$e->getMessage()}".PHP_EOL;
			$result = json_encode($err_mesage);
			die($result);
		}

	}

	$err_mesage['error'][] = $text;
	$result = json_encode($err_mesage);
	die($result);
}

// test printing
function testPrint($arr){
	echo("<pre>");
	print_r($arr);
	echo("</pre>");
}

// MySQL connect =============================================================
function connectMySQL(){
	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
	$mysql = mysqli_connect(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB);

	return $mysql;
}




// Parse array elements
function arrayParsing($arr, $separator){
	foreach($arr as $value){
		$a = explode($separator, $value);
		for($i = 0; $i<count($a); $i++){
			$a[$i] = full_trim($a[$i]);
		};
		$result[] = $a;
	};
 	return $result;
}

//
function trec_eval($qrels, $run){
	$q_url = PROJECT_DIR . "trec/qrels/" . $qrels;
	$r_url = PROJECT_DIR . "trec/run/" . $run;
	
	$ls = exec("./trec/bin/trec_eval -q $q_url $r_url", $ret_arr, $ret_val);
	$result = arrayParsing($ret_arr, "\t");
	return $result;
}

//create associative array
function trec_assoc_arr($trec_arr, $id=1, $el_name=0, $val=2){
	foreach ($trec_arr as $value){
		$trec_assoc_arr[$value[$id]][$value[$el_name]] = $value[$val];
	}
	return $trec_assoc_arr;
}

// Parse text
function txtToArr($file, $separator) {
	$handle = fopen($file, "r") or die("Cannot open file:  " . $file);
	if ($handle) {
		$array = explode("\n", fread($handle, filesize($file)));
	}
	fclose($handle);
	
	$result = arrayParsing($array, $separator);

	return $result;
}


function arrToAssoc($arr, $id=0) {
	foreach ($arr as $value){
		$assoc_arr[$value[$id]][] = $value;
	}
	return $assoc_arr;
}
