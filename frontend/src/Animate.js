import anime from 'animejs/lib/anime.es.js';


const Animate = {
    
    openSignIn(){
        anime({
            targets: '.durak, .App-alternate h3, .enterName, .joinTable',
            direction: 'reverse',
            translateY: -1000,
            duration: 1000,
            easing: 'easeInOutExpo'
        });
    },

}

export default Animate