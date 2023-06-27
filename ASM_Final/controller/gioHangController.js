app.controller("gioHangController", function ($scope, $rootScope) {
  $rootScope.tinhTongTien();
  $scope.tangSoLuong = (sanpham) => {
    sanpham.soLuongTrongGioHang++;
    $rootScope.tinhTongTien();
  };
  $scope.modal = new bootstrap.Modal(
    document.getElementById("deleteProductInCart"),
    {}
  );

  $scope.giamSoLuong = (sanpham) => {
    if (sanpham.soLuongTrongGioHang === 1) {
      $scope.moHopThoaiXoaSanPham(sanpham);
    } else {
      sanpham.soLuongTrongGioHang--;
    }
    $rootScope.tinhTongTien();
  };

  $scope.moHopThoaiXoaSanPham = (sanpham) => {
    $scope.modal.show();
    $rootScope.deletedProduct = sanpham;
  };
  $scope.xoaSanPham = () => {
    $scope.modal.hide();
    $rootScope.xoaSanPhamTrongGioHang();
  };

  $scope.thanhtoan = () => {
    $rootScope.gioHang = [];
    $rootScope.tongTien = 0;
  };
});
