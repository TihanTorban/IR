<?php
 
require("inc/config.inc.php");
require("inc/functions.php");

// page to be served (main by default)
$page = isset($_REQUEST['page']) ? $_REQUEST['page'] : "trec_eval";

$smarty->assign("page", $page);
$smarty->display("index.tpl");

// $q = PROJECT_DIR . "/trec/qrels/qrels.txt";
// $array = txtToArr($q, "\t");
// print_r($array);

// $r = trec_eval("qrels.txt", "PRMS.run");

// $assoc = trec_assoc_arr($r);
// echo"<pre>";
// print_r($assoc);
// echo"</pre>";


?>
