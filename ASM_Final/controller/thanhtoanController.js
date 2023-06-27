app.controller(
    "thanhtoanController",
    function ($scope, $rootScope) {
        $scope.thanhToan = () => {
            alert("Đặt Hàng Thành Công !!");
            $rootScope.customer = {
                name: "",
                address: "",
                phone: "",
            };
            $rootScope.gioHang = [];
            $rootScope.tongTien = 0;
        }
    }
);
