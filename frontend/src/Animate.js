import anime from 'animejs/lib/anime.es.js';


const Animate = {
    
    openSignIn(){
        anime({
            targets: '.durak, .enterName, .App-alternate h3',
            direction: 'reverse',
            translateY: -600,
            duration: 1000,
            easing: 'easeInOutExpo'
        });
    },

}

export default Animate