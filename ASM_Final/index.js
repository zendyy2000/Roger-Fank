// import products from "db/products.js";
var app = angular.module("app", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "views/home.html",
      controller: "homeController",
    })
    .when("/sanpham/:id", {
      templateUrl: "views/sanPham.html",
      controller: "sanphamController",
    })
    .when("/baiViet", {
      templateUrl: "views/baiViet.html",
      controller: "baivietController",
    })
    .when("/gioHang", {
      templateUrl: "views/gioHang.html",
      controller: "gioHangController",
    })
    .when("/thanhtoan", {
      templateUrl: "views/thanhToan.html",
    })
    .when("/dangnhap", {
      templateUrl: "views/DangNhap.html",
    })
    .when("/baivietchitiet", {
      templateUrl: "views/baiVietChiTiet.html",
      controller: "baivietController",
    })
    .when("/hethongstore", {
      templateUrl: "views/heThongStore.html",
    })
    .when("/sanphamchitiet/:id", {
      templateUrl: "views/sanPhamChiTiet.html",
      controller: "sanPhamChiTietController",
    });
});

app.run(function ($rootScope, $http, $location) {
  const dbPaths = ["blogs", "categories", "products"];
  $rootScope.keyword = "";
  $rootScope.activeRoute = "";
  $rootScope.gioHang = [];
  $rootScope.tongSanPham = 0;
  $rootScope.countDownTimerId = null;
  $rootScope.products = [];
  $rootScope.categories = [];
  $rootScope.blogs = [];
  $rootScope.selectedProduct = {};
  $rootScope.soluong = 1;
  $rootScope.tongTien = 0;
  $rootScope.deletedProduct = {};
  $rootScope.customer = {
    name: "",
    address: "",
    phone: "",
  };

  $rootScope.dathang = () => {
    alert("Đặt Hàng Thành Công !!");
    $rootScope.customer = {
      name: "",
      address: "",
      phone: "",
    };
    $rootScope.gioHang = [];
    $rootScope.tongTien = 0;
    $rootScope.tongSanPham = 0;
  };

  function getData(path) {
    $http.get(`db/${path}.json`).then(
      (res) => {
        $rootScope[path] = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  dbPaths.forEach((path) => getData(path));

  $http.get("db/blogs.json").then(
    (res) => {
      $rootScope.blogs = res.data;
    },
    (err) => {
      console.log(err);
    }
  );
  const tinhTongSoLuongSanPham = () => {
    let tongSP = 0;
    for (let i = 0; i < $rootScope.gioHang.length; i++) {
      tongSP += $rootScope.gioHang[i].soLuongTrongGioHang;
    }
    return tongSP;
  };

  $rootScope.moHopThoaiThemSanPham = (sanpham) => {
    $rootScope.selectedProduct = sanpham;
    $rootScope.selectedProduct.selectedColor =
      $rootScope.selectedProduct.mauSP[0];
    $rootScope.selectedProduct.selectedSize =
      $rootScope.selectedProduct?.sizeSP &&
      $rootScope.selectedProduct?.sizeSP[0];
    $rootScope.soluong = 1;
    const myModal = new bootstrap.Modal(
      document.getElementById("AddToCartModal"),
      {}
    );
    myModal.show();
  };

  $rootScope.daTonTaiTrongGioHang = (sanpham) => {
    for (let i = 0; i < $rootScope.gioHang.length; i++) {
      if (
        sanpham.id === $rootScope.gioHang[i].id &&
        $rootScope.gioHang[i].selectedColor === sanpham.selectedColor
      ) {
        if (
          sanpham?.selectedSize &&
          $rootScope.gioHang[i].selectedSize !== sanpham.selectedSize
        ) {
          return null;
        } else {
          return $rootScope.gioHang[i];
        }
      }
    }
    return null;
  };

  $rootScope.themSanPhamVaoGioHang = (sanpham, soluong = 1) => {
    let sp = $rootScope.daTonTaiTrongGioHang(sanpham);
    if (sp) {
      sp.soLuongTrongGioHang += soluong;
    } else {
      sanpham.soLuongTrongGioHang = soluong;
      $rootScope.gioHang.push({ ...sanpham });
    }
    $rootScope.tongSanPham = tinhTongSoLuongSanPham();
    $rootScope.tinhTongTien();
    showToastMessage("themSanPhamThanhCong");
    bootstrap.Modal.getOrCreateInstance(
      document.getElementById("AddToCartModal")
    ).hide();
  };

  $rootScope.muaNgay = (sanpham, soluong = 1) => {
    let sp = $rootScope.daTonTaiTrongGioHang(sanpham);
    if (sp) {
      sp.soLuongTrongGioHang += soluong;
    } else {
      sanpham.soLuongTrongGioHang = soluong;
      $rootScope.gioHang.push({ ...sanpham });
    }
    $rootScope.tongSanPham = tinhTongSoLuongSanPham();
    $rootScope.tinhTongTien();
  };

  $rootScope.giamsoluong = () => {
    if ($rootScope.soluong > 1) {
      $rootScope.soluong--;
    }
  };

  $rootScope.tangsoluong = () => {
    $rootScope.soluong++;
  };

  $rootScope.tinhTongTien = () => {
    $rootScope.tongTien = $rootScope.gioHang.reduce((prev, curr) => {
      return (
        prev + curr.soLuongTrongGioHang * curr.giaSP * (1 - curr.salePercent)
      );
    }, 0);
  };

  $rootScope.xoaSanPhamTrongGioHang = () => {
    $rootScope.gioHang = $rootScope.gioHang.filter(
      (sp) => sp.id !== $rootScope.deletedProduct.id
    );
    new bootstrap.Modal(document.getElementById("deleteProductInCart")).hide();
    $rootScope.tinhTongTien();
    $rootScope.tongSanPham = tinhTongSoLuongSanPham();
  };

  $rootScope.$on("$routeChangeSuccess", () => {
    window.scroll(0, 0);
    if ($rootScope.countDownTimerId) {
      clearInterval($rootScope.countDownTimerId);
      $rootScope.countDownTimerId = null;
    }
    let path = $location.path();
    $rootScope.activeRoute = path;
    $rootScope.endSearch();
  });

  $rootScope.setSelectedColor = function (color) {
    $rootScope.selectedProduct.selectedColor = color;
  };

  $rootScope.setSelectedSize = function (size) {
    $rootScope.selectedProduct.selectedSize = size;
  };

  $rootScope.startSearch = () => {
    console.log($rootScope.keyword);
    $rootScope.keyword = "";
    const searchBox = document.querySelector(".search-box");
    const searchBtn = document.querySelector(".search-icon");
    const cancelBtn = document.querySelector(".cancel-icon");
    const searchInput = document.querySelector("input");
    const searchResult = document.querySelector(".search-result");
    searchBox.classList.add("active");
    searchBtn.classList.add("active");
    searchInput.classList.add("active");
    cancelBtn.classList.add("active");
    searchInput.focus();
    searchResult.style.display = "flex";
  };

  $rootScope.endSearch = () => {
    const searchBox = document.querySelector(".search-box");
    const searchBtn = document.querySelector(".search-icon");
    const cancelBtn = document.querySelector(".cancel-icon");
    const searchInput = document.querySelector("input");
    const searchResult = document.querySelector(".search-result");
    searchBox.classList.remove("active");
    searchBtn.classList.remove("active");
    searchInput.classList.remove("active");
    cancelBtn.classList.remove("active");
    searchInput.value = "";
    searchResult.style.display = "none";
    $rootScope.keyword = "";
  };
});

app.filter("vietnamCurrency", function () {
  return function (input, symbol, place) {
    if (isNaN(input)) {
      return input;
    } else {
      var symbol = symbol || " VNĐ";
      var place = place === undefined ? true : place;
      if (place) {
        return new Intl.NumberFormat("de-DE").format(input) + symbol;
      } else {
        return symbol + new Intl.NumberFormat("de-DE").format(input);
      }
    }
  };
});
