(function($, win){
  var navEles = $('.nav-item')
  navEles.on('click', function(event){
    var _this = $(this)
    if(_this.find('.sub-nav').length > 0) {
      _this.toggleClass('active')
    }
  })
})(jQuery, window)