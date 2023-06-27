app.controller(
  "sanPhamChiTietController",
  function ($scope, $rootScope, $routeParams) {
    $scope.product = $rootScope.products.find(
      (pro) => pro.id == $routeParams.id
    );

    $scope.sameProduct = $rootScope.products.filter(
      (pro) =>
        pro.categoryId === $scope.product.categoryId &&
        pro.childrenCategoryId === $scope.product.childrenCategoryId
    );

    $scope.image = $scope.product.imgSP[0];

    $scope.setImage = (src) => {
      $scope.image = src;
    };

    $scope.selectedColor = $scope.product.mauSP[0];
    $scope.selectColor = (color) => {
      $scope.selectedColor = color;
    };

    $scope.sizes = $scope.product.sizeSP || [];
    $scope.selectedSize = $scope.product?.sizeSP && $scope.product?.sizeSP[0];
    $scope.selectSize = (size) => {
      $scope.selectedSize = size;
    };
    $scope.isShowMore = false;

    $scope.showMoreDescription = () => {
      let btnShowmore = document.querySelector(".show-more-btn");
      btnShowmore.onclick = () => {
        document.getElementById("showmore").classList.toggle("show");
      };
      $scope.isShowMore = !$scope.isShowMore;
    };

    $scope.themSanPhamVaoGioHang = (product) => {
      if ($scope.sizes.length > 0) {
        $rootScope.themSanPhamVaoGioHang({
          ...product,
          selectedColor: $scope.selectedColor,
          selectedSize: $scope.selectedSize,
        });
      } else {
        $rootScope.themSanPhamVaoGioHang({
          ...product,
          selectedColor: $scope.selectedColor,
        });
      }
    };
  }
);
