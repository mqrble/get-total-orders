/*
* Please copy all the code into the console so that you wont get any errors (https://shopee.vn/)
* Modify the item per pull based on your hardware, the browser could crash if the number is too high.
* Code by trndk
*/

var totalOrders = 0;
var totalSpent = 0;
var totalShippingSpent = 0;
var totalItems = 0;
var fetchingData = true;
var offset = 0;
var itemPerFetch = 50;

function getStatistics() {
	var orders = [];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			orders = JSON.parse(this.responseText)['orders'];
			totalOrders += orders.length;
	        fetchingData = orders.length >= 10;
			orders.forEach(order => {
				let tpa = order['paid_amount'] / 100000;
				totalSpent += tpa;
				let tpsa = order['shipping_fee'] / 100000;
                totalShippingSpent += tpsa;
                order['items'].forEach(item => {
                    let tpti = item['amount'];
                    totalItems += tpti;
                });
			});
			offset += 10;

			// Correct spelling
			var orderIsNumberable = ' order'
			if (totalOrders > 1) {
				orderIsNumberable = ' orders'
			}

			console.log('You bought: ' + totalOrders + orderIsNumberable);
			if (fetchingData) {
				console.log('Retrieving data...');
				getStatistics();
			}
			else {
				console.log('%cTotal orders: '+ '%c' +moneyFormat(totalOrders), 'font-size: 30px;','font-size: 30px; color:red');
                console.log('%cTotal items: '+ '%c' +moneyFormat(totalItems), 'font-size: 30px;','font-size: 30px; color:red');
				console.log('%cMoney spent: '+ '%c' + '$' +moneyFormat(totalSpent), 'font-size: 30px;','font-size: 30px; color:red');
				console.log('%cShipping spent: '+ '%c' + '$' +moneyFormat(totalShippingSpent), 'font-size: 30px;','font-size: 30px; color:red');
			}
		}
	};
	xhttp.open('GET', 'https://shopee.vn/api/v1/orders/?order_type=3&offset=' + offset + '&limit=' + itemPerFetch, true);
	xhttp.send();
}

function moneyFormat(number, fixed=0) {
	if (isNaN(number)) return 0;
	number = number.toFixed(fixed);
	let delimeter = ',';
	number += '';
	let rgx = /(\d+)(\d{3})/;
	while (rgx.test(number)) {
		number = number.replace(rgx, '$1' + delimeter + '$2');
	}
	return number;
}

getStatistics();