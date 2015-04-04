<div class="tab-pane fade in active" id="evaluation">
	<div class="row coll_sett runs_a_b">
		<div class="col-md-5 col-sm-6 col-xs-12">
			<label>RUNs A</label>
			<select name="runs_a" id="runs_a"></select>
		</div>
		<div class="col-md-5 col-sm-6 col-xs-12">
			<label>RUNs B</label>
			<select name="runs_b" id="runs_b"></select>
		</div>
		<div class="col-md-2 col-sm-6 col-xs-12">
			<input type="button" value="Submit" id="submit_compare">
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
	<div class="row chart coll_sett" id="chart">
		<div class="col-md-12 col-sm-12 col-xs-12">
			<div id="plot"></div>
		</div>
	</div>
	
	<div class="row coll_sett naturalLG">
		<div class="col-md-6 col-sm-6 col-xs-12">
			<div class='trec_eval_data naturalLG' id="a">
			</div>
		</div>
		<div class="col-md-6 col-sm-6 col-xs-12">
			<div class='trec_eval_data naturalLG' id="b"></div>
		</div>
	</div>
	
	<div class="row coll_sett">
		<div class="col-md-6 col-sm-6 col-xs-12">
			<div class='trec_eval_data' id="a"></div>
		</div>
		<div class="col-md-6 col-sm-6 col-xs-12">
			<div class='trec_eval_data' id="b"></div>
		</div>
	</div>
	
	<span data-tooltip="hint">url</span><br/>
	<span data-tooltip="hint">url</span><br/>
	<span data-tooltip="hint">url</span><br/>
	<span data-tooltip="hint">url</span><br/>
	<div id="tooltip"></div>
	
</div>	