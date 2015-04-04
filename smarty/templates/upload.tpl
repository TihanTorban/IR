<div class="modal fade bs-example-modal-lg" id="upload" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
      	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
      	 <h4 class="modal-title">Upload</h4>
      </div>
      <div class="modal-body">
        <form id="upload_files" enctype="multipart/form-data" action="uploadToDB.php" method="post">
	        <div class="row">
		        <div class="col-md-3 col-sm-3 col-xs-12">
		        	<label>Collection Name</label><br/>
					<input name="collection_name" id="collection_name" type="text" style="display: inline" />
			    </div>
		    </div>
	        <div class="row">
		        <div class="col-md-3 col-sm-3 col-xs-12">
					<label>queries</label><br/>
					<input name="file-queries" 	id="upload_queries" 	type="file"	style="display: inline" />
				</div>
				<div class="col-md-3 col-sm-3 col-xs-12">
					<label>qrels</label><br/>
					<input name="file-qrels" 	id="upload_qrels" 		type="file"	style="disabled: disabled; display:inline" disabled/>
				</div>
				<div class="col-md-3 col-sm-3 col-xs-12">
					<label>runs</label><br/>
				    <input name="file-runs[]" 	id="upload_runs" 		type="file"	style="disabled: disabled; display:inline" multiple="true" disabled/>
				</div>
				<div class="col-md-3 col-sm-3 col-xs-12"> 
				    <input type="submit" value="Upload" id="upload_sett" disabled style=" display:inline"/>

				    <span id="status" ></span>
				</div>
			</div>
    	</form>
      </div>
    </div>
  </div>
</div>