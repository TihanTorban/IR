<?php /* Smarty version Smarty-3.1.19, created on 2015-04-06 10:32:45
         compiled from "/home/gluck/workspace/Bachelor/smarty/templates/index.tpl" */ ?>
<?php /*%%SmartyHeaderCode:552501654ef9f9c032c50-68296638%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'aedc9de2499a8495a76343c790dc0a7cf9a0afc4' => 
    array (
      0 => '/home/gluck/workspace/Bachelor/smarty/templates/index.tpl',
      1 => 1428309161,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '552501654ef9f9c032c50-68296638',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.19',
  'unifunc' => 'content_54ef9f9c23a7c9_61864681',
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_54ef9f9c23a7c9_61864681')) {function content_54ef9f9c23a7c9_61864681($_smarty_tpl) {?><html>
    <head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		
        <title>Bachelor - Information Retrieval</title>
        
        <!-- jQuery -->
        	<!--script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script-->
	        <script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
	        <!--script type="text/javascript" src="./js/ajaxupload.3.5.js"></script-->
	        
	        <!--script type="text/javascript" src="./js/jquery-2.1.3.js"></script-->
                
        <!-- Bootstrap -->
        <link rel="stylesheet" href="//cdn.jsdelivr.net/bootstrap/3.3.0/css/bootstrap.min.css">
        <script src="//cdn.jsdelivr.net/bootstrap/3.3.0/js/bootstrap.min.js"></script>
        
        <!--Load the AJAX API-->
			<script type="text/javascript"
				src="https://www.google.com/jsapi?autoload={
					'modules':[{
						'name':'visualization',
						'version':'1',
						'packages':['corechart']
					}]
			}">
			</script>
			
		<script type="text/javascript" src="js/script.js"></script>
		
		<link rel="stylesheet" href="style.css">

    </head>
    <body>
        <?php echo $_smarty_tpl->getSubTemplate ("navbar.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, null, array(), 0);?>

        <?php echo $_smarty_tpl->getSubTemplate ("upload.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, null, array(), 0);?>

        
        <div class="tab-content">
            
            
            <?php echo $_smarty_tpl->getSubTemplate ("trec_eval.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, null, array(), 0);?>

            <?php echo $_smarty_tpl->getSubTemplate ("info.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, null, array(), 0);?>

        </div>
        
    </body>
</html><?php }} ?>
