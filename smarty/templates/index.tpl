<html>
    <head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		
        <title>Bachelor - Information Retrieval</title>
        
        <!-- jQuery -->
        	<!--script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script-->
	        <!--script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script-->
	        <!--script type="text/javascript" src="./js/ajaxupload.3.5.js"></script-->
	        
	        <script type="text/javascript" src="./js/jquery-2.1.3.js"></script>
                
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
		
		<link rel="stylesheet" href="style.css">

    </head>
    <body>
        {* include file="navbar.tpl" *}
        
        <div class="container">
            {* include the file that is called $page. We set the value of $page in index.php *}
            {include file="$page.tpl"}
        </div>
        
    </body>
</html>