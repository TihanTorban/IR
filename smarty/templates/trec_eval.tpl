<div class="tab-pane fade in active" id="evaluation">
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
		<div class="col-md-3 col-sm-4 col-xs-12 parameters">
			<label>Parameters</label>
			<select name="trec_eval_param" id="trec_eval_param"></select>
		</div>
		<div class="col-md-6 col-sm-4 col-xs-12 order">
			<label>Ordered by:</label>
			<input type="radio" name="order" value='1' checked/><span id='run_name_a'>A</span>
			<input type="radio" name="order" value='2'/><span id='run_name_b'>B</span>
			<input type="radio" name="order" value='3'/><span id='run_name_d'>Dif</span>
			<input class="radio_all" type="radio" name="order" value='4'/><span class="radio_all">all</span>
		</div>
		<div class="col-md-3 col-sm-4 col-xs-12 chart_type">
			<label>Chart type:</label>
			<input type="radio" name="chart_type" value='line' checked/><span id='line'>Line</span>
			<input type="radio" name="chart_type" value='pie'/><span id='pie'>Pie</span>
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
				<span id="nl_abs_a" class="nl"></span></br></br>
				<span id="nl_abs_b" class="nl"></span></br></br>
				<span id="nl_text" class="nl"></span>
			</div>
		</div>
	</div>
	
	<div class="row coll_sett run_data">
		<div class="col-md-6 col-sm-6 col-xs-12">
			<pre class='a'></pre>
		</div>
		<div class="col-md-6 col-sm-6 col-xs-12">
			<pre class='b'></pre>
		</div>
	</div>

</div>