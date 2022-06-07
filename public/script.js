AOS.init();

console.log(`Welcome to 
╭━━━┳━╮╱╭┳━━━┳━━╮
┃╭━╮┃┃╰╮┃┃╭━╮┣┫┣╯
┃┃╱╰┫╭╮╰╯┃┃╱┃┃┃┃
┃┃╱╭┫┃╰╮┃┃╰━╯┃┃┃
┃╰━╯┃┃╱┃┃┃╭━╮┣┫┣╮
╰━━━┻╯╱╰━┻╯╱╰┻━━╯
`)


  $("#scroller").simplyScroll({
      customClass: "simply-scroll",
      frameRate: 20,
      speed: 1,
      orientation: "horizontal",
      auto: !0,
      autoMode: "loop",
      manualMode: "end",
      direction: "forwards",
      startOnLoad: !1,
      initialOffset: 0
  });

  $("#scrollerBottom").simplyScroll({
      customClass: "simply-scroll",
      frameRate: 24,
      speed: 1,
      orientation: "horizontal",
      auto: !0,
      autoMode: "loop",
      manualMode: "end",
      direction: "backwards",
      startOnLoad: !1,
      initialOffset: 0
  });


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



