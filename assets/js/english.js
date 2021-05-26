(function(){

    var momentumRoot;
    var momentumEls;
  
    // Page and element location and dimentions
    function momentumInit() {
        momentumRoot.setProperty('--viewportwidth',window.innerWidth);
        momentumRoot.setProperty('--viewportheight',window.innerHeight);
  
        var widthValue = document.getElementById('widthValue');
        widthValue.innerHTML = window.innerWidth + 'px';
        for (i = 0; i < momentumEls.length; i++) {
            var e = momentumEls[i];
            e.style.setProperty('--height',e.offsetHeight);
            e.style.setProperty('--top',e.offsetTop);
        }
    };
  
    // When the DOM is loaded
    document.addEventListener( 'DOMContentLoaded', function () {
        momentumRoot = document.body.style;
        momentumEls = document.querySelectorAll('.momentumcss');
        filter();
  
        // Initialize variables
        momentumRoot.setProperty('--scrolly',window.scrollY);
  
        // Scroll events
        window.addEventListener('scroll',momentumScroll,false);
        function momentumScroll() {
            momentumRoot.setProperty('--scrolly',window.scrollY);
        }
  
        momentumInit();
    }, false );
  
    // When the page has fully loaded
    window.onload = function(){
        momentumInit();
    };
    window.addEventListener('resize',momentumInit);
  })();
  
  
  function navtoggle() {
      document.getElementById('nav').classList.toggle('active');
  }
  
  
  function filter() {
      const ua = navigator.userAgent;
      var safari = false;
      console.log(ua);
      if (navigator.userAgent.indexOf("Safari") !== -1) {
          safari = true;
      }
      if (navigator.userAgent.indexOf("Chrome") !== -1) {
          safari = false;
      }
      if (safari) {
          window.onload = function(){
              const style = document.createElement('style');
              style.innerHTML = '*{animation:none}';
              document.head.appendChild(style);
              setTimeout(() => {
                document.head.removeChild(style);
              }, 1);
          };
          document.body.classList.add('safari');
      }
  }