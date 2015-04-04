<?php
 
require("inc/config.inc.php");
require("inc/functions.php");

// page to be served (main by default)
$page = isset($_REQUEST['page']) ? $_REQUEST['page'] : "trec_eval";

$smarty->assign("page", $page);
$smarty->display("index.tpl");

?>
