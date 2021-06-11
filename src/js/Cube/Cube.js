import anime from 'animejs';

export default function(selectors) {
  anime({
    targets: selectors,
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 1500,
    delay: function(el, i) {
      return i * 250;
    },
  });
}
