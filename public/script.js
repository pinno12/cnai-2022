AOS.init();

// $(".nav-link").hover(
//   function () {
//     $(this).addClass("line");
//   },
//   function () {
//     $(this).removeClass("line");
//   }
// );


// $('.nav-link').each(function(){
//   var item = $(this);

//   item.mouseenter(function(){
//      item.toggleClass('line');
//   });

//   item.mouseleave(function(){
//      item.toggleClass('line');
//   });
// });



  // fix menu when passed
  $('.masthead')
    .visibility({
      once: false,
      onBottomPassed: function() {
        $('.fixed.menu').transition('fade in');
      },
      onBottomPassedReverse: function() {
        $('.fixed.menu').transition('fade out');
      }
    })
  ;

var myCarousel = document.querySelector('#myCarousel')
var carousel = new bootstrap.Carousel(myCarousel, {
  interval: 0
})

$('.ui.sticky')
  .sticky({
    context: '#example1'
  })
;

// ellipse and circle
$('.ui.sticky')
  .sticky({
    context: '#content'
  })
;

$('.ui.sidebar')
  .sidebar('setting', 'transition', 'overlay')
  // .sidebar('toggle')
  .sidebar('attach events', '.open.button', 'show')
  .sidebar('setting','dimPage', false )
;

$('.ui.modal')
.modal('show')
;


$('.tool-tip').popup();


$('.ui.dropdown')
  .dropdown()
;
$('.ui.checkbox')
.checkbox()
;


$('.accordion')
.accordion({
  selector: {
    trigger: '.title'
  }
})
;



