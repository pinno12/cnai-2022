AOS.init();

console.log(`Welcome to 
╭━━━┳━╮╱╭┳━━━┳━━╮
┃╭━╮┃┃╰╮┃┃╭━╮┣┫┣╯
┃┃╱╰┫╭╮╰╯┃┃╱┃┃┃┃
┃┃╱╭┫┃╰╮┃┃╰━╯┃┃┃
┃╰━╯┃┃╱┃┃┃╭━╮┣┫┣╮
╰━━━┻╯╱╰━┻╯╱╰┻━━╯
`)


var myCarousel = document.querySelector('#myCarousel')
showUp = (myId, category) => {
  let blur = myId + '-img';
  let title = myId + '-title';
  let btn = myId + '-btn';
  let say = '.' + myId;
  
  document.getElementsByClassName(blur)[0].classList.toggle("bg-blur");
  document.getElementsByClassName(btn)[0].classList.toggle("c-btn-active");
  $(say)
    .transition('fade up')
    ;
  if (category == 'home'){
    document.getElementsByClassName(title)[0].classList.toggle("text-white");
  }
}

homeShow = (myId) =>{
  let blur = myId + '-img';
  let title = myId + '-title';
  let btn = myId + '-btn';
  
  let say = '.' + myId;

  
  $(say)
    .transition('fade up')
    ;
}


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

// $('.accordion')
// .accordion({
//   selector: {
//     trigger: '.title'
//   }
// })
// ;
