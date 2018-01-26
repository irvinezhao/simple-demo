(function($, win){

  function attachLoadEvent() {
    $('.spf-link').on('click', function(event){
      event.preventDefault()
      spf.load(event.target.getAttribute('href'), {onDone: function(){
        attachLoadEvent()
      }})
    })
  }

  spf.init()
  attachLoadEvent()
})(jQuery, window)