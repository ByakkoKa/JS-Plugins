/**
 * Plugin criado por:
 * Paulo Cezario
 * https://github.com/ByakkoKa
 **/
(function() {
    let cheking = true;

    const feAnim = Array.from(document.querySelectorAll('.anim'));

    function isOnScreen(el) {
        let rect = el.getBoundingClientRect(); 
        return rect.top > 0 && rect.bottom < window.innerHeight;
    }

    function playAnimation(el) {
        if(isOnScreen(el)) el.style.animationPlayState = 'running';
    }

    // Executa apenas uma vez a cada 150ms
    function render() {
        if(cheking) {
            feAnim.forEach(playAnimation); 
            cheking = false;
        }
        else setTimeout(cheking = true, 150);
    } 

    // Exibe os elementso que já estão
    // na tela antes do primeiro scroll
    render();

    window.addEventListener('scroll', render);
})();