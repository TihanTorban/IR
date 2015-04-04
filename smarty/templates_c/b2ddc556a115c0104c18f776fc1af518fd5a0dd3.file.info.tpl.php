<?php /* Smarty version Smarty-3.1.19, created on 2015-04-03 23:04:31
         compiled from "/home/gluck/workspace/Bachelor/smarty/templates/info.tpl" */ ?>
<?php /*%%SmartyHeaderCode:1661578702551eff9da990e5-45592623%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'b2ddc556a115c0104c18f776fc1af518fd5a0dd3' => 
    array (
      0 => '/home/gluck/workspace/Bachelor/smarty/templates/info.tpl',
      1 => 1428095065,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '1661578702551eff9da990e5-45592623',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.19',
  'unifunc' => 'content_551eff9da9c8b7_43212922',
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_551eff9da9c8b7_43212922')) {function content_551eff9da9c8b7_43212922($_smarty_tpl) {?><div class="tab-pane fade" id="info">
	<pre>
		Major measures (again) with their relational names:
		num_ret        	Total number of documents retrieved over all queries
		num_rel        	Total number of relevant documents over all queries
		num_rel_ret    	Total number of relevant documents retrieved over all queries
		map            	Mean Average Precision (MAP)
		gm_ap          	Average Precision. Geometric Mean, q_score=log(MAX(map,.00001))
		R-prec         	R-Precision (Precision after R (= num-rel for topic) documents retrieved)
		bpref          	Binary Preference, top R judged nonrel
		recip_rank     	Reciprical rank of top relevant document
		ircl_prn.0.00  	Interpolated Recall - Precision Averages at 0.00 recall
		ircl_prn.0.10  	Interpolated Recall - Precision Averages at 0.10 recall
		ircl_prn.0.20  	Interpolated Recall - Precision Averages at 0.20 recall
		ircl_prn.0.30  	Interpolated Recall - Precision Averages at 0.30 recall
		ircl_prn.0.40  	Interpolated Recall - Precision Averages at 0.40 recall
		ircl_prn.0.50  	Interpolated Recall - Precision Averages at 0.50 recall
		ircl_prn.0.60  	Interpolated Recall - Precision Averages at 0.60 recall
		ircl_prn.0.70  	Interpolated Recall - Precision Averages at 0.70 recall
		ircl_prn.0.80  	Interpolated Recall - Precision Averages at 0.80 recall
		ircl_prn.0.90  	Interpolated Recall - Precision Averages at 0.90 recall
		ircl_prn.1.00  	Interpolated Recall - Precision Averages at 1.00 recall
		P5             	Precision after 5 docs retrieved
		P10            	Precision after 10 docs retrieved
		P15            	Precision after 15 docs retrieved
		P20            	Precision after 20 docs retrieved
		P30            	Precision after 30 docs retrieved
		P100           	Precision after 100 docs retrieved
		P200           	Precision after 200 docs retrieved
		P500           	Precision after 500 docs retrieved
		P1000          	Precision after 1000 docs retrieved
	</pre>
</div><?php }} ?>
