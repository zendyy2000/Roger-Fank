app.controller(
  "sanphamController",
  function ($scope, $rootScope, $routeParams) {
    $scope.categories = [
      ...$rootScope.categories,
      { id: -1, name: "Khuyến mãi", img: "img/khuyenMaiNotHover.png" },
    ];
    $scope.activeCategory = $scope.categories.find(
      (item) => item.id == $routeParams.id
    );
    $scope.products = [];

    $scope.filterPrices = [
      { min: 500000, max: 1000000 },
      { min: 1000000, max: 2000000 },
      { min: 2000000, max: 3000000 },
    ];

    $scope.selectedPrices = [];

    $scope.selectPrice = (filterPrice) => {
      if ($scope.selectedPrices.includes(filterPrice)) {
        $scope.selectedPrices = $scope.selectedPrices.filter(
          (item) => item !== filterPrice
        );
      } else {
        $scope.selectedPrices.push(filterPrice);
      }
      if ($scope.selectedPrices.length === 0) {
        handleFilterCategory($scope.activeCategory.id);
      } else {
        let result = [];
        $scope.selectedPrices.forEach((item) => {
          result.push(item.min);
          result.push(item.max);
        });

        let minPrice = Math.min(...result);
        let maxPrice = Math.max(...result);
        $scope.products = $scope.products.filter((item) => {
          return (
            item.giaSP * (1 - item.salePercent) < maxPrice &&
            item.giaSP * (1 - item.salePercent) >= minPrice
          );
        });
      }
    };

    const sortOptions = [
      { name: "Sắp xếp", asc: 0 },
      { name: "Giá tăng dần", asc: 1 },
      { name: "Giá giảm dần", asc: -1 },
    ];

    $scope.sortOptions = sortOptions;

    $scope.selectedOption = $scope.sortOptions[0];

    $scope.handleSort = () => {
      if ($scope.selectedOption.asc === 1) {
        $scope.products = $scope.products.sort(
          (a, b) =>
            a.giaSP * (1 - a.salePercent) - b.giaSP * (1 - b.salePercent)
        );
      } else if ($scope.selectedOption.asc === -1) {
        $scope.products = $scope.products.sort(
          (a, b) =>
            b.giaSP * (1 - b.salePercent) - a.giaSP * (1 - a.salePercent)
        );
      }
    };

    const handleFilterCategory = (cateId) => {
      if (cateId === -1) {
        $scope.products = $rootScope.products.filter(
          (pro) => pro.sale === true
        );
      } else {
        $scope.products = $rootScope.products.filter(
          (pro) => pro.categoryId === cateId
        );
      }
    };

    handleFilterCategory($scope.activeCategory.id);
    $scope.setActiveCategory = (cate) => {
      handleFilterCategory(cate.id);
      $scope.activeCategory = cate;
    };

    $scope.limit = 6;
    $scope.begin = 0;
    $scope.currentPage = 1;

    $scope.getTotalPage = () => {
      let totalPage = Math.ceil($scope.products.length / $scope.limit);
      let result = [];
      for (let i = 1; i <= totalPage; i++) {
        result.push(i);
      }
      return result;
    };

    $scope.changePage = (page) => {
      $scope.begin = (page - 1) * $scope.limit;
      $scope.currentPage = page;
    };

    $scope.nextPage = () => {
      if ($scope.currentPage < $scope.getTotalPage().length) {
        $scope.changePage($scope.currentPage + 1);
      }
    };

    $scope.prevPage = () => {
      if ($scope.currentPage > 1) {
        $scope.changePage($scope.currentPage - 1);
      }
    };
  }
);
