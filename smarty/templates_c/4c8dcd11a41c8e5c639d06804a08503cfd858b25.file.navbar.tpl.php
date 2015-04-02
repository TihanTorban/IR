<?php /* Smarty version Smarty-3.1.19, created on 2015-03-01 19:33:17
         compiled from "/home/gluck/workspace/Bachelor/smarty/templates/navbar.tpl" */ ?>
<?php /*%%SmartyHeaderCode:104320566654f35b6d72c832-51811019%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '4c8dcd11a41c8e5c639d06804a08503cfd858b25' => 
    array (
      0 => '/home/gluck/workspace/Bachelor/smarty/templates/navbar.tpl',
      1 => 1424192303,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '104320566654f35b6d72c832-51811019',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.19',
  'unifunc' => 'content_54f35b6d778717_80413860',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_54f35b6d778717_80413860')) {function content_54f35b6d778717_80413860($_smarty_tpl) {?><nav class="navbar navbar-default" role="navigation">
	<div class="container-fluid">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar">
				<span class="sr-only">Modules</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="index.php?">Home</a>
		</div>
		<div class="collapse navbar-collapse" id="navbar">
			<ul class="nav navbar-nav">
				<li class="active"><a href="index.php?page=chart">Chart</a></li>
				<li><a href="index.php?page=trec_eval">trec_eval</a></li>
				<li><a href="test.php">test</a></li>
			</ul>
		</div>
	</div>
</nav>
<?php }} ?>
