function generateHistoryElement(ownAddr, from, to, value, date) {
	if (from==ownAddr) {
		from="Me";
	} else if (to==ownAddr) {
		to = "Me";
	}
	if (from.length == 42) {
		from = from.slice(2,9)
	}
	if (to.length == 42) {
		to = to.slice(2,9)
	}

  let html = '';
  html += `
  <li class="list-group-item">
    <a href="#">`
    html += from+`</a> → `
    html += `<a href="#">`
    html += to+`</a>
	<br>
      <small>`+unixtimeToDate(date)+`</small>
		<div class="float-right">
		`;

	if (from==="Me") {
		html += `<span class="badge color_output">`
		value = -value;
	} else {
		html += `<span class="badge color_input">`
	}

  html += formatMoney(value/100)+` KVT</span>
    </div>
  </li>
  `;
  return html;
}


function getHistory(addr) {
	axios.get(RELAYURL + '/history/' + addr)
	  .then(function (res) {
	    console.log(res.data);
	    if (res.data.txs!=null) {
	      printHistory(addr, res.data.txs);
	    }
	    // generateHistoryChart(addr, res.data.transfers);
	  })
	  .catch(function (error) {
	    console.log(error);
	    toastr.error(error);
	  });
}

function printHistory(ownAddr, transfers) {
  let html = '';
  for(let i=0; i<transfers.length; i++) {
	  if(transfers[i].amount>0) {
		html += generateHistoryElement(ownAddr, transfers[i].from, transfers[i].to, transfers[i].amount, transfers[i].timestamp);
	  }
  }
  document.getElementById('historyBox').innerHTML = html;
}

function generateHistoryChart(ownAddr, transfers) {
	// prepare data
	let ab = 0; // acumulated balance
	let data = {
		labels: [],
		datasets: [{
			steppedLine: true,
			data: [],
			borderColor: [
				'#5ae1cd'
			]
		}]
	};
	for(let i=transfers.length-1; i>=0; i--) {
		if(transfers[i].Value>0) {
			// data.datasets[0].label = "saldo";
			if (transfers[i].From==ownAddr) {
				ab = ab - transfers[i].Value;
			} else if (transfers[i].To==ownAddr) {
				ab = ab + transfers[i].Value;
			}
			data.labels.push(unixtimeToDate(transfers[i].Timestamp));
			data.datasets[0].data.push(ab);

		}
	}

	// print chart
	var ctx = document.getElementById("historyChart").getContext('2d');
	var options= {
		legend : {
		  display: false
		},
		scales: {
			xAxes: [
				{
					display: false
				}
			],
		  yAxes: [
		    {
		      ticks: {
		        beginAtZero: true
		      }
		    }
		  ]
		}
	};
	var myLineChart = new Chart(ctx, {
	    type: 'line',
	    data: data,
	    options: options
	});
}


function getBalance() {
	console.log("recuperant saldo", myAddr);
	// show current myAddr balance
	axios.get(RELAYURL + '/balance/' + myAddr)
	  .then(function (res) {
			$("#myBalanceBox").fadeIn(100).fadeOut(100).fadeIn(100);

			if (!initialized || myBalance != Number(res.data.balance)) {
				if (initialized) {
					beep();
					toastr.success("Balance updated: " + Number(res.data.balance)/100);
					getHistory(myAddr);
					 // as the relay needs some time to get the history data:
					setTimeout(getHistory(myAddr), 10000);
				} else {
					initialized = true;
				}
				myBalance = Number(res.data.balance);
				onBalanceChanged()
			}

	    console.log(res.data);
	    console.log("balance " + myBalance);
	    document.getElementById('myBalanceBox').innerHTML=formatMoney(myBalance/100);
	    document.getElementById('spinnerBalance').className = 'spinner-border invisible';
	  })
	  .catch(function (error) {
	    console.log(error);
	    toastr.error(error);
	    document.getElementById('spinnerBalance').className = 'spinner-border invisible';
	  });
}

function onBalanceChanged() {
	$('#amountlabel').text("Amount ("+formatMoney(myBalance/100)+"KVT available)")
	getHistory(myAddr);
}
