// import CSS
import '../assets/styles/reset.scss';
import '../assets/styles/style.scss';
// import '../assets/styles/github-markdown.css'

// import Scene
// import './scene/darkness';
// import './Scene/oceanWithCubes';
// import './scene/plots'
// import './scene/theMoon'
import './scene/bg';

const isMobile = window.innerWidth < 768;
class mainQuoteScroll {
  constructor(wrapper, sticky) {
    this.wrapper = wrapper;
    this.sticky = sticky;
    this.header = this.wrapper.querySelector('header');
    this.main = this.wrapper.querySelector('main');
    this.mainEl = document.getElementsByTagName('main');
    this.bg = this.wrapper.querySelector('#bg');
  }

  animate() {
    // console.log('scrollY', scrollY, this.totalVh);
    // if (scrollY <= window.innerHeight/10) {
    if (isMobile) {
      this.bg.style.width = '100vw';
      this.sticky.style.height = '100vh';
    }
    const checkVh = isMobile ? 10 : 50;
    if (scrollY < checkVh) {
      this.sticky.style.display = '';
      this.bg.style.display = '';
      // this.sticky.style.transform = `translateY${-scrollY})`;
    } else if (scrollY == checkVh) {
      scrollTo(0, 100);
    } else {
      this.sticky.style.display = 'none';
      this.bg.style.display = 'none';
    }
  }
}
class mainBodyScroll {
  constructor(wrapper, sticky, mobileVh) {
    this.wrapper = wrapper;
    this.sticky = sticky;
    this.mobileVh = mobileVh;
    this.webVh = mobileVh + 50;
  }

  animate() {
    const checkVh = isMobile ? this.mobileVh : this.webVh;
    if (checkVh - 50 < scrollY && scrollY < checkVh) {
      // this.sticky.style.display = '';
      this.sticky.style.top = `${scrollY - checkVh + 10}px`;
    } else if (scrollY == checkVh) {
      scrollTo(0, checkVh + 100);
    } else {
      // this.sticky.style.display = 'none';
      this.sticky.style.top = `${scrollY - checkVh}px`;
    }
  }
}
const body = document.querySelector('body');
const main = document.querySelector('main');
const quoteSticky = document.querySelector('.sticky');
const mainSticky1 = main.querySelectorAll('.sticky-main')[0];
const mainSticky2 = main.querySelectorAll('.sticky-main')[1];
const MainQuoteScroll = new mainQuoteScroll(body, quoteSticky);
const BodyQuoteScroll1 = new mainBodyScroll(main, mainSticky1, 50);
const BodyQuoteScroll2 = new mainBodyScroll(main, mainSticky2, 100);
window.addEventListener('resize', () => {
  // MainQuoteScroll.animate();
  // BodyQuoteScroll1.animate();
  // BodyQuoteScroll2.animate();
});
window.addEventListener('scroll', () => {
  // console.log(scrollY);
  // MainQuoteScroll.animate();
  // BodyQuoteScroll1.animate();
  // BodyQuoteScroll2.animate();
});
window.addEventListener('load', () => {
  // MainQuoteScroll.animate();
  // BodyQuoteScroll1.animate();
  // BodyQuoteScroll2.animate();
});
