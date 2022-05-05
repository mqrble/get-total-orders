/*
* Vui lòng copy tất cả code vào console để không gặp lỗi (https://tiki.vn/)
* Điều chỉnh số đơn hàng mỗi lượt lấy dữ liệu tùy vào phần cứng để tránh crash trình duyệt.
* Code by trndk
*/

var totalOrders = 0;
var totalSpent = 0;
var fetchingData = true;
var page = 1;
var itemPerFetch = 50;

function getStatistics() {
	var orders = [];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			orders = JSON.parse(this.responseText)['data'];
			fetchingData = orders.length >= 10;
			orders = orders.filter(order => order['status'] == 'hoan_thanh');
			totalOrders += orders.length;
			orders.forEach(order => {
				let tpa = order["grand_total"];
				totalSpent += tpa;		
			});
			page += 1;
			console.log('Bạn đã đặt: ' + totalOrders + ' đơn hàng');
			if (fetchingData) {
				console.log('Đang lấy dữ liệu...');
				getStatistics();
			}
			else {
				console.log("%cTổng đơn hàng đã giao: "+ '%c' +moneyFormat(totalOrders), 'font-size: 30px;','font-size: 30px; color:red');
				console.log("%cTổng chi tiêu: "+ '%c' +moneyFormat(totalSpent)+"đ", 'font-size: 30px;','font-size: 30px; color:red');
			}
		}
	};
	xhttp.open('GET', 'https://tiki.vn/api/v2/me/orders?page=' + page + itemPerFetch, true);
	xhttp.send();
}

function moneyFormat(number, fixed = 0) {
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