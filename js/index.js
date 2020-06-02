


setTimeout(function() {

  console.log("myAddr", localStorage.getItem("myAddr"));
  console.log("mySk", localStorage.getItem("mySk"));
  if (localStorage.getItem("myAddr")===null) {
    let obj = newKey();
    console.log("newKey", obj);
    /*
	 How privK is stored in localStorage:
	 [key] -> [value]
	 'myAddr' -> addr
	 addr -> e(privK)	encrypted by passphrase private key, at this moment is not encrypted
	 */
    localStorage.setItem("myAddr", obj.address);
    localStorage.setItem("mySk", obj.sk);
    console.log("sk", obj.sk);
    toastr.success("New wallet created! Address: " + obj.address);
    // downloadBackup();
  }
  myAddr = localStorage.getItem("myAddr");
  console.log("myAddr", myAddr);


  // show myAddr QR
  new QRCode(document.getElementById('qrcode'), myAddr);
  $("#qrcode > img").css({"margin":"auto"});
  // show myAddr
  document.getElementById('myAddrBox').value=myAddr;
  document.getElementById('myAddrLabel').innerHTML=myAddr;

  refreshBalance();

}, 2000);



function transact() {
  let toAddr = document.getElementById("toAddr").value;
  if(toAddr==undefined) {
    toastr.error("invalid address");
    return;
  }
  if(toAddr=="") { // TODO check also if it's a valid address
    toastr.error("invalid address");
    return;
  }
  let amount = Number(100*Number(document.getElementById("amount").value));
  amount = Number(amount.toFixed(0));
  if(amount>myBalance) {
    toastr.error("not enough funds");
    return;
  }
  if(amount<=0) {
    toastr.error("incorrect amount");
    return;
  }
  document.getElementById('spinnerTx').className = 'spinner-border';
  axios.get(RELAYURL + '/nonce/' + myAddr)
    .then(function (res) {
      myNonce = res.data.nonce;
      console.log(res.data);
      console.log("myNonce " + myNonce);

      // TODO wasm newTxAndSign()
      console.log(txData);
      axios.post(RELAYURL + '/tx', txData)
	.then(function (res) {
	  console.log(res.data);
	  toastr.success("transferència realitzada");
	  $('.nav-tabs a[href="#history"]').tab('show');
	  document.getElementById('spinnerTx').className += 'invisible';
	})
	.catch(function (error) {
	  console.log(error);
	  toastr.error(error);
	  document.getElementById('spinnerTx').className += 'invisible';
	})

    }) // nonce get error catch
    .catch(function (error) {
      console.log(error);
      toastr.error(error);
      document.getElementById('spinnerTx').className += 'invisible';
    })
}

function onSendDataChanged() {

  const toAddr = $("#toAddr").val()
  const toAmountStr = $("#amount").val()
  const toAmount = Number(toAmountStr)

  const enabled = (
    toAddr.length > 0
    && toAmount > 0
    && toAmount <= myBalance/100
    && /^[0-9]+((\.)[0-9]{0,2}){0,1}$/.test(toAmountStr)
  );

  $("#sendButton").prop('disabled',!enabled)
}

$("#toAddr").on("change paste keyup", function() {
  onSendDataChanged();
});

$("#amount").on("change paste keyup", function() {
  onSendDataChanged();
});


function onSendTabActivated() {
  document.getElementById("amount").value = "";
  document.getElementById("toAddr").value = "";
  document.getElementById('toAddr').className = 'form-control invisible';
  document.getElementById('toAddr').className = 'form-control invisible';
  document.getElementById('qrscannerBox').className = 'visible';
  startScanQR();
}

function onHistoryTabActivated() {
  getBalance();
  stopScanQR();
}

function onRecieveTabActivated() {
  stopScanQR();
}

function onConfigTabActivated() {
  stopScanQR();
}

function refreshBalance() {
  getBalance();
  setTimeout(function(){
    refreshBalance();
  }, 30000);
}

