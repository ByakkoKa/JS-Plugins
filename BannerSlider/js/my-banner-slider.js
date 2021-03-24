/**
 * Plugin criado por:
 * Paulo Cezario
 * https://github.com/ByakkoKa
 **/

(function() {// Verifica se é mobile 
    const isMobile = Boolean(document.body.scrollWidth < 600);

    document.querySelectorAll('.my-banner-slider').forEach( banner => {
        const dataHeight = banner.getAttribute('data-height');
        const childrens = banner.querySelectorAll('.item');
        const mobileHeight = banner.getAttribute('data-mobile-height'); 

        if(banner.getAttribute('data-timeplay') == null) 
            banner.setAttribute('data-timeplay', '10');

        banner.setAttribute('data-pos', '0');
        banner.style.maxHeight = `${dataHeight}px`; 

        childrens.forEach( child => {
            let imgBg = child.querySelector('.bg');

            child.style.background = `rgba(0, 0, 0, 0) url(${imgBg.getAttribute('src')}) no-repeat center`;   

            if(isMobile && mobileHeight != null) {
                banner.style.height = `${mobileHeight}px`;
                child.style.height = `${mobileHeight}px`;
            } 
            else {
                banner.style.height = `${dataHeight}px`;
                child.style.height = `${dataHeight}px`;
            }

            imgBg.remove(child); 

        })

        if(childrens.length > 1) bannerNavWappers(banner, childrens);
        else childrens[0].style.opacity = 1;
    })

    // Adiciona captions
    function bannerNavWappers(banner, childrens) {
        const captions = [];
        const wappers = document.createElement('div');

        wappers.setAttribute('class', 'nav');
        banner.appendChild(wappers);

        for(let i = 0; i < childrens.length; i++) {
            const items = document.createElement('span');
            items.setAttribute('data-pos', `${i}`);
            wappers.appendChild(items);
            captions.push(items);
        }

        if(!isMobile) bannerNavControles(banner, childrens, captions);
        setBanner(banner, childrens, captions, 0, 1);
        bannerCaptionListeners(banner, childrens, captions);
        BannerTouchSlider(banner, childrens, captions);
    }

    // Adicion Controles
    function bannerNavControles(banner, childs, capts) {
        const left = document.createElement('div');
        const right = document.createElement('div');

        left.setAttribute('class', 'left-arrow');
        right.setAttribute('class', 'right-arrow');

        left.innerHTML = '‹';
        right.innerHTML = '›';

        banner.appendChild(left);
        banner.appendChild(right);

        left.style.marginTop = `-${left.scrollHeight / 2}px`;
        right.style.marginTop = `-${right.scrollHeight / 2}px`;  

        // Previnir seleção, nas setas
        left.addEventListener('selectstart', (event) => {event.preventDefault()});
        right.addEventListener('selectstart', (event) => {event.preventDefault()});
        
        left.addEventListener('click', () => bannerLeft(banner, childs, capts));
        right.addEventListener('click', () => bannerRight(banner, childs, capts));
    }

    // Definir banner
    function setBanner(banner, child, caption, index, old) {    
        if(!banner.isChanging) {
            clearTimeout(banner.bannerAutoPlay);

            banner.addEventListener('mouseover', () => {
                clearTimeout(banner.bannerAutoPlay);
            });

            // Define auto play      
            banner.bannerAutoPlay =  setTimeout(() => {
                return bannerRight(banner, child, caption);
                }, Number(banner.getAttribute('data-timeplay')) * 1000);

            banner.addEventListener('mouseleave', () => {
                banner.bannerAutoPlay =  setTimeout(() => {
                    return bannerRight(banner, child, caption);
                }, Number(banner.getAttribute('data-timeplay')) * 1000);
            });            

            // Define que esta em transição
            banner.isChanging = true;
            banner.setAttribute('data-pos', `${index}`);
            child[old].style.zIndex = '0';
            child[old].removeAttribute('rel');
            caption[old].removeAttribute('class');

            child[index].setAttribute('rel', 'active-banner');
            child[index].style.zIndex = 1;
            caption[index].setAttribute('class', 'active');

            setTimeout(() => {
                banner.isChanging = false;
            }, 500);        

        }
    }

    // Adicionar Listeners
    function bannerCaptionListeners(banner, childrens, captions) {
        for(let i = 0; i < captions.length; i++) {
            captions[i].addEventListener('click', () => {
                let pos = Number(banner.getAttribute('data-pos'));
                if(pos != i) setBanner(banner, childrens, captions, i, pos);
            });
        }
    }

    function bannerLeft(banner, childrens, captions) {
        let pos = Number(banner.getAttribute('data-pos'));
        if(pos > 0) return setBanner(banner, childrens, captions, (pos - 1), pos);
        if(pos == 0) return setBanner(banner, childrens, captions, (captions.length - 1), pos);
    }

    function bannerRight(banner, childrens, captions) {
        let pos = Number(banner.getAttribute('data-pos'));
        if(pos < captions.length - 1) return setBanner(banner, childrens, captions, (pos + 1), pos);    
        if(pos == captions.length - 1) return setBanner(banner, childrens, captions, 0, pos);
    }

    // Mouse Slider
    function BannerTouchSlider(banner, childs, caption) {
        let startX;
        let disX;

        if(!isMobile) {
            banner.addEventListener('mousedown', e => {
                startX = e.pageX; // Define local do click no eixo X
            });
            banner.addEventListener('mouseup',  e => {
                disX = startX - e.pageX; // Define distancia wue o click se arrasta
                if(disX < -100) bannerRight(banner, childs, caption);
                if(disX > 100) bannerLeft(banner, childs, caption);    
            });
        }
        else {
            banner.addEventListener('touchstart', e => {
                startX = e.changedTouches[0].pageX; // Define local do click no eixo X            
            });
            banner.addEventListener('touchend',  e => {
                disX = startX - e.changedTouches[0].pageX;
                if(disX < -100) bannerRight(banner, childs, caption);
                if(disX > 100) bannerLeft(banner, childs, caption);   
            });
        }    
    }
})();