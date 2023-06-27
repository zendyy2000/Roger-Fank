app.controller("homeController", function ($scope, $rootScope) {
  $scope.saleProducts = $rootScope.products.filter((pro) => pro.sale);

  $scope.vi = $rootScope.products.filter(
    (pro) => pro.categoryId === 2 && pro.childrenCategoryId === 2
  );

  $scope.tui = $rootScope.products.filter(
    (pro) => pro.categoryId === 2 && pro.childrenCategoryId === 1
  );

  $scope.giay = $rootScope.products.filter((pro) => pro.categoryId === 1);

  $scope.phanloaigiay = $rootScope.categories[0].childrens;
  $scope.doiPhanLoaiGiay = (id) => {
    $scope.giay = $rootScope.products.filter(
      (pro) => pro.categoryId === 1 && pro.childrenCategoryId === id
    );
  };

  $scope.showCountDown = () => {
    const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24;

    //I'm adding this section so I don't have to keep updating this pen every year :-)
    //remove this if you don't need it
    let today = new Date(),
      dd = String(today.getDate()).padStart(2, "0"),
      mm = String(today.getMonth() + 1).padStart(2, "0"),
      yyyy = today.getFullYear(),
      nextYear = yyyy + 1,
      dayMonth = "3/25/",
      saleDate = dayMonth + yyyy;

    today = mm + "/" + dd + "/" + yyyy;
    if (today > saleDate) {
      saleDate = dayMonth + nextYear;
    }
    //end

    const countDown = new Date(saleDate).getTime();
    $rootScope.countDownTimerId = setInterval(function () {
      const now = new Date().getTime(),
        distance = countDown - now;

      document.getElementById("days").innerText = Math.floor(distance / day);
      document.getElementById("hours").innerText = Math.floor(
        (distance % day) / hour
      );
      document.getElementById("minutes").innerText = Math.floor(
        (distance % hour) / minute
      );
      document.getElementById("seconds").innerText = Math.floor(
        (distance % minute) / second
      );

      //do something later when date is reached
      if (distance < 0) {
        document.getElementById("headline").innerText = "It's my saleDate!";
        document.getElementById("countdown").style.display = "none";
        document.getElementById("content").style.display = "block";
        clearInterval($rootScope.countDownTimerId);
      }
      //seconds
    }, 0);
  };
  $scope.showCountDown();
});
