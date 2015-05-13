<?php

/** 
 * Config file
 */

// making sure errors are displayed
ini_set("display_errors", 1);
error_reporting(E_ALL);

// Project dir
define ('DIRSEP', DIRECTORY_SEPARATOR);

// Path to you site
$site_path = realpath(dirname(__FILE__) . DIRSEP."..". DIRSEP) . DIRSEP;
define("PROJECT_DIR",  $site_path);
	
// Smarty installation path
define("SMARTY_PATH", PROJECT_DIR."smarty");

// init Smarty
require(SMARTY_PATH . "/Smarty.class.php");
$smarty = new Smarty();

$smarty->setTemplateDir(PROJECT_DIR . "/smarty/templates");
$smarty->setCompileDir(PROJECT_DIR . "/smarty/templates_c");
$smarty->setCacheDir(PROJECT_DIR . "/smarty/cache");
$smarty->setConfigDir(PROJECT_DIR . "/smarty/configs");

// MySQL settings
define("MYSQL_HOST", "localhost");
define("MYSQL_USER", "ir_user");
define("MYSQL_PASSWORD", "1qaz");
// define("MYSQL_DB", "ir"); 
define("MYSQL_DB", "dbttorban");


?>
