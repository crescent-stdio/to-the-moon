// import CSS
import '../assets/styles/reset.scss';
import '../assets/styles/github-markdown.scss';
import '../assets/styles/style.scss';
// import '../assets/styles/github-markdown.css'

// import Scene
// import './scene/darkness';
// import './Scene/oceanWithCubes';
// import './scene/plots'
// import './scene/theMoon'
import './scene/mainScene';
import './scene/introScene';
import './scene/starField';

const isMobile = window.innerWidth < 768;
import Swiper, { Navigation, Pagination, Keyboard, Mousewheel } from 'swiper';

// configure Swiper to use modules
Swiper.use([Navigation, Pagination, Keyboard, Mousewheel]);

// init Swiper:
const swiper = new Swiper('.mySwiper', {
  direction: 'vertical',
  slidesPerView: 1,
  spaceBetween: 30,
  mousewheel: {
    forceToAxis: true,
    sensitivity: 1,
    releaseOnEdges: true,
  },
  keyboard: { enabled: true, onlyInViewport: false },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  slidesPerGroup: 1,
  observer: true,
  observeParents: true,
  autoplayDisableOnInteraction: false,
});

// swiper.updateContainerSize();
