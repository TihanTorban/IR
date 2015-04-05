<?php /* Smarty version Smarty-3.1.19, created on 2015-04-05 12:14:22
         compiled from "/home/gluck/workspace/Bachelor/smarty/templates/navbar.tpl" */ ?>
<?php /*%%SmartyHeaderCode:104320566654f35b6d72c832-51811019%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '4c8dcd11a41c8e5c639d06804a08503cfd858b25' => 
    array (
      0 => '/home/gluck/workspace/Bachelor/smarty/templates/navbar.tpl',
      1 => 1428228859,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '104320566654f35b6d72c832-51811019',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.19',
  'unifunc' => 'content_54f35b6d778717_80413860',
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_54f35b6d778717_80413860')) {function content_54f35b6d778717_80413860($_smarty_tpl) {?><ul class="nav nav-tabs topbar">
	<li>
		<img class="buttom" data-toggle="modal" data-target="#upload" src="./img/add_db.png" height="30" width="30"/>
	</li>
	<li>
		<label id="collections_l">Collections</label>
		<select name="collections" id="collection_sett"></select>
	</li>
	<li class="active">
		<a href="#evaluation" data-toggle="tab">Evaluation</a>
	</li>
	<li>
		<a href="#info" data-toggle="tab">INFO</a>
	</li>
</ul><?php }} ?>
