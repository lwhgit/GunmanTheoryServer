var __topBar = $("#topBar");
var __bodyWrapper = $("#bodyWrapper");
var __topBarHeight = 64;
var __topBarInterval = 0;

function hideTopBar() {
  clearInterval(__topBarInterval);

  __topBarInterval = setInterval(function() {
    __topBarHeight -= 1;
    __topBar.css("height", __topBarHeight + "px");
    __bodyWrapper.css("padding-top", (__topBarHeight + 4) + "px");

    if (__topBarHeight == 0) {
      clearInterval(__topBarInterval);
      __topBar.css("display", "none");
    }
  }, 2);
}

function showTopBar() {
  clearInterval(__topBarInterval);

  __topBar.css("display", "block");
  __topBarInterval = setInterval(function() {
    __topBarHeight += 1;
    __topBar.css("height", __topBarHeight + "px");
    __bodyWrapper.css("padding-top", (__topBarHeight + 4) + "px");

    if (__topBarHeight == 64) {
      clearInterval(__topBarInterval);
    }
  }, 2);
}
