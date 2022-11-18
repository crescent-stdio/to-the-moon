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
    this.children = this.sticky.querySelector('.main-quote');
    this.length = this.children.length;
    this.totalVh = 100;
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
    if (scrollY <= checkVh) {
      this.sticky.style.display = '';
      this.bg.style.display = '';
      // this.sticky.style.transform = `translateY${-scrollY})`;
    } else {
      this.sticky.style.display = 'none';
      this.bg.style.display = 'none';
    }
  }
}
const body = document.querySelector('body');
const sticky = document.querySelector('.sticky');
const MainQuoteScroll = new mainQuoteScroll(body, sticky);
window.addEventListener('resize', () => {
  MainQuoteScroll.animate();
});
window.addEventListener('scroll', () => {
  MainQuoteScroll.animate();
});
window.addEventListener('load', () => {
  MainQuoteScroll.animate();
});

