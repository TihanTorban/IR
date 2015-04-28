<?php /* Smarty version Smarty-3.1.19, created on 2015-04-27 23:38:51
         compiled from "/home/gluck/workspace/Bachelor/smarty/templates/trec_eval.tpl" */ ?>
<?php /*%%SmartyHeaderCode:83164565354ef9f9c23f866-60064323%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '7941f6f864ba7ae69577d90a7026010e1af2dfd5' => 
    array (
      0 => '/home/gluck/workspace/Bachelor/smarty/templates/trec_eval.tpl',
      1 => 1430170709,
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
<?php if ($_valid && !is_callable('content_54ef9f9c25a334_67469356')) {function content_54ef9f9c25a334_67469356($_smarty_tpl) {?><div class="tab-pane fade in active" id="evaluation">
	<div class="row coll_sett runs_a_b">
		<div class="col-md-12 col-sm-12 col-xs-12">
			<ul class="nav nav-pills">
				<li class="dropdown runs">
					<button type="button" class="btn btn-default dropdown-toggle a" value=-1 data-toggle="dropdown"><span class="text">Choose metod A</span> <span class="caret"></span></button>
					<ul class="dropdown-menu a" role="menu"></ul>
				</li>
				<li class="dropdown runs">
					<button type="button" class="btn btn-default dropdown-toggle b" value=-1 data-toggle="dropdown"><span class="text">Choose metod B</span> <span class="caret"></span></button>
					<ul class="dropdown-menu b" role="menu"></ul>
				</li>
				<li class="dropdown runs">
					<button role="button" value="Submit" id="submit_compare">Compare</button>
				</li>
			</ul>
		</div>
	</div>
	
	<div class="row chart coll_sett" id="chart_param">
		<div class="col-md-4 col-sm-5 col-xs-12">
			<label>Parameters</label>
			<select name="trec_eval_param" id="trec_eval_param"></select>
		</div>
		<div class="col-md-8 col-sm-7 col-xs-12">
			<label>Ordered by:</label>
			<input type="radio" name="order" value='1' checked/><span id='run_name_a'>A</span>
			<input type="radio" name="order" value='2'/><span id='run_name_b'>B</span>
			<input type="radio" name="order" value='3'/><span id='run_name_d'>Dif</span>
			<input type="radio" name="order" value='4'/><span>all</span>
		</div>
	</div>
	<div class="row chart coll_sett chart">
		<div class="col-md-12 col-sm-12 col-xs-12">
			<div id="plot"></div>
		</div>
	</div>
	
	<div class="row coll_sett naturalLG">
		<div class="col-md-12 col-sm-12 col-xs-12">
			<div class='trec_eval_data naturalLG'>
			<h3 id="nl_head">Natural language results</h3>
			<span id="nl_abs_a"></span></br></br>
			<span id="nl_abs_b"></span></br></br>
			<span id="nl_text"></span>
			</div>
		</div>
	</div>
	
	<div class="row coll_sett run_data">
		<div class="col-md-6 col-sm-6 col-xs-12">
			<div class='a'></div>
		</div>
		<div class="col-md-6 col-sm-6 col-xs-12">
			<div class='b'></div>
		</div>
	</div>

</div><?php }} ?>
