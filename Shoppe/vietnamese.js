/*
* Vui lòng copy tất cả code vào console để không gặp lỗi (https://shopee.vn/)
* Điều chỉnh số đơn hàng mỗi lượt lấy dữ liệu tùy vào phần cứng để tránh crash trình duyệt.
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

			console.log('Bạn đã đặt: ' + totalOrders + ' đơn hàng');
			if (fetchingData) {
				console.log('Đang lấy dữ liệu...');
				getStatistics();
			}
			else {
				console.log('%cTổng đơn hàng đã giao: '+ '%c' +moneyFormat(totalOrders), 'font-size: 30px;','font-size: 30px; color:red');
                console.log('%cTổng sản phẩm đã giao: '+ '%c' +moneyFormat(totalItems), 'font-size: 30px;','font-size: 30px; color:red');
				console.log('%cTổng chi tiêu: '+ '%c' +moneyFormat(totalSpent) + 'đ', 'font-size: 30px;','font-size: 30px; color:red');
				console.log('%cTổng tiền ship: '+ '%c'  +moneyFormat(totalShippingSpent) + 'đ', 'font-size: 30px;','font-size: 30px; color:red');
			}
		}
	};
	xhttp.open('GET', 'https://shopee.vn/api/v1/orders/?order_type=3&offset=' + offset + '&limit=' + itemPerFetch, true);
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