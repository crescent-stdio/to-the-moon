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
  }

  animate() {
    // console.log('scrollY', scrollY, this.totalVh);
    if (scrollY <= 50) {
      this.sticky.style.display = '';
      // this.sticky.style.transform = `translateY${-scrollY})`;
      // this.header.style.transform = `translate3d(-50%, ${-scrollY}, 0)`;
    } else {
      this.sticky.style.display = 'none';
      // this.header.style.transform = `translate3d(-50%, ${scrollY}, 0)`;
    }
  }
}
const body = document.querySelector('body');
const sticky = document.querySelector('.sticky');
const MainQuoteScroll = new mainQuoteScroll(body, sticky);
window.addEventListener('resize', () => {
  MainQuoteScroll.animate();
})
window.addEventListener('scroll', () => {
  MainQuoteScroll.animate();
});
window.addEventListener('load', () => {
  MainQuoteScroll.animate();
});
