function resetWallet() {
	var r = confirm("If you didn't stored a backup you'll not be able to recover the wallet. Are you sure to delte the storage?");
	if (r == true) {
	  toastr.info("Generating a new wallet");
	  localStorage.clear();
	  location.reload();
	} else {
	  toastr.info("Cancelled. Wallet reset cancelled.");
	}
}
