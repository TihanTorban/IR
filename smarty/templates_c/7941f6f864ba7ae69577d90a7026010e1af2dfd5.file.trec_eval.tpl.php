<?php /* Smarty version Smarty-3.1.19, created on 2015-04-01 13:22:48
         compiled from "/home/gluck/workspace/Bachelor/smarty/templates/trec_eval.tpl" */ ?>
<?php /*%%SmartyHeaderCode:83164565354ef9f9c23f866-60064323%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '7941f6f864ba7ae69577d90a7026010e1af2dfd5' => 
    array (
      0 => '/home/gluck/workspace/Bachelor/smarty/templates/trec_eval.tpl',
      1 => 1427887363,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '83164565354ef9f9c23f866-60064323',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.19',
  'unifunc' => 'content_54ef9f9c25a334_67469356',
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_54ef9f9c25a334_67469356')) {function content_54ef9f9c25a334_67469356($_smarty_tpl) {?><script type="text/javascript" src="js/script.js"></script>

<div class="topbar">
	<img class="buttom" src="./img/add_db.png" id="upload_img" alt="Upload" height="30" width="30">
</div>

<div id="upload_popup" class="popup">
    <div id="close" class="stem bottomright"></div>
    <div id="popup_inner" class="popupInner">
        <form id="upload_files" enctype="multipart/form-data" action="uploadToDB.php" method="post">
	        <div class="row">
		        <div class="col-md-3 col-sm-3 col-xs-12">
		        	<label>Collection Name</label><br/>
					<input name="collection_name" 	id="collection_name" 	type="text"	style="display: inline" />
			    </div>
		    </div>
	        <div class="row">
		        <div class="col-md-3 col-sm-3 col-xs-12">
					<label>queries</label><br/>
					<input name="file-queries" 	id="queries" 	type="file"	style="display: inline" />
				</div>
				<div class="col-md-3 col-sm-3 col-xs-12">
					<label>qrels</label><br/>
					<input name="file-qrels" 	id="qrels" 		type="file"	style="disabled: disabled; display:inline" disabled/>
				</div>
				<div class="col-md-3 col-sm-3 col-xs-12">
					<label>runs</label><br/>
				    <input name="file-runs[]" 	id="runs" 		type="file"	style="disabled: disabled; display:inline" multiple="true" disabled/>
				</div>
				<div class="col-md-3 col-sm-3 col-xs-12"> 
				    <input type="submit" value="Upload" id="upload" disabled style=" display:inline"/>

				    <span id="status" ></span>
				</div>
			</div>
    	</form>
    </div>
</div>


<div class="row">
	<div class="col-md-12 col-sm-12 col-xs-12">
		<label id="collections_l">Collections</label>
		<select name="collections" id="collection_sett"></select>
	</div>
</dir>

<div class="row" id="runs_a_b">
	<div class="col-md-5  col-sm-6 col-xs-12">
		<label>RUNs A</label>
		<select name="runs_a" id="runs_a"></select>
	</div>
	<div class="col-md-5  col-sm-6 col-xs-12">
		<label>RUNs B</label>
		<select name="runs_b" id="runs_b"></select>
	</div>
	<div class="col-md-2  col-sm-6 col-xs-12">
		<input type="button" value="Submit" id="submit_compare">
	</div>
</div>

<div class="row chart" id="chart_param">
	<div class="col-md-4  col-sm-5 col-xs-12">
		<label>Parameters</label>
		<select name="trec_eval_param" id="trec_eval_param"></select>
	</div>
	<div class="col-md-8  col-sm-7 col-xs-12">
		<label>Ordered by:</label>
		<input type="radio" name="order" value='1' checked/><span id='run_name_a'>A</span>
		<input type="radio" name="order" value='2'/><span id='run_name_b'>B</span>
		<input type="radio" name="order" value='3'/><span>Dif</span>
		<input type="radio" name="order" value='4'/><span>all</span>
	</div>
	<div class="col-md-12  col-sm-12 col-xs-12">
		<div id="plot"></div>
	</div>
</div>



<div class="row">
	<div class="col-md-6 col-sm-6 col-xs-12">
		<pre id="trec_eval_data_a"></pre>
	</div>
	<div class="col-md-6  col-sm-6 col-xs-12">
		<pre id="trec_eval_data_b"></pre>
	</div>
</div>
<?php }} ?>
