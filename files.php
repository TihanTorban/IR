<?php

require("inc/config.inc.php");
require("inc/functions.php");

if (isset($_GET["file"])){
	if ($_GET["file"] == "all"){
		$qrelsDir = "trec/qrels";
		$runDir = "trec/run";

		$qrelsFiles = getFilesList($qrelsDir);
		$runFiles = getFilesList($runDir);
		
		$result = array("qrel" => $qrelsFiles,
						"run" => $runFiles);
		
		echo json_encode($result); //return

	}
}else{
	echo "";
}

function getFilesList($dir){
	$files = array_values(array_filter(scandir($dir), function($file) {
		return !is_dir($file);
	}));
	return $files;
}
?>