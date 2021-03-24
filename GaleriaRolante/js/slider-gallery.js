/**
 * Plugin criado por:
 * Paulo Cezario
 * https://github.com/ByakkoKa
 **/
(function() {
    const isMobile = Boolean(document.body.scrollWidth < 600);

    document.querySelectorAll('.my-slider-gallery').forEach( gallery => {
        // Adiciona controladores
        gallery.innerHTML += `<div class="left"><span>‹</span></div>\n<div class="right"><span>›</span></div>\n<div class="dots"></div>`;
        
        const data  = {
            width: parseFloat(gallery.scrollWidth),
            height: Number(gallery.getAttribute('data-height')),
            show: Number(gallery.getAttribute('data-show')),
            spacing: parseFloat(gallery.getAttribute('data-spacing')),
            auto: gallery.getAttribute('data-autoplay'),
            getChildWidth: false,
            childrenWidth: null,
            totalWidth: 0,        
        };

        if(isMobile){
            const mobileShow = gallery.getAttribute('data-mobile-show');
            const mobileHeigt = gallery.getAttribute('data-mobile-height');

            if(mobileShow != null) data['show'] = Number(mobileShow);
            if(mobileHeigt != null)  data['height'] = Number(mobileHeigt);
        }

        const container = gallery.querySelector('.container');
        const childrens = container.querySelectorAll('.item');
        const left = gallery.querySelector('.left');
        const right = gallery.querySelector('.right');
        const dots = gallery.querySelector('.dots');

        childrens.forEach( e => {
            if(!data ['getChildWidth']) {
                data ['childrenWidth'] = Math.floor((data ['width'] / data ['show']) + 
                (data ['spacing'] / data ['show']) - data ['spacing']);
                data ['getChildWidth'] = true;
                data ['totalWidth'] = (Number(data ['childrenWidth']) + data ['spacing']) * childrens.length - data ['spacing'];
            }
            e.style.height = `${data ['height']}px`;
            e.style.width = `${data ['childrenWidth']}px`;
            e.style.marginRight = `${data ['spacing']}px`;
            e.addEventListener('selectstart', preventEvent); 
            e.addEventListener('dragstart', preventEvent);
        })

        container.style.height = `${data ['height']}px`;

        // Adicionando Dots
        const dotNum = data ['totalWidth'] / data ['width'];
        
        if(dotNum > 1){
            let i;
            let position = 0 - data ['spacing'];

            for(i = 1; i < dotNum; i++){
                dots.innerHTML += `<div rel="${i}" data-location="${position}"></div>`;
                position += (data ['width'] - i); 
            }
            if(data ['totalWidth'] - position > data ['childrenWidth']){
                dots.innerHTML += `<div rel="${i}" data-location="${position}"></div>`;
            }

            dots.style.marginLeft = `-${dots.scrollWidth / 2}px`;
            container.scrollLeft = 0;
            dots.childNodes[0].classList.add('active');

            dots.querySelectorAll('div').forEach( element => {
                element.addEventListener('click', () => {
                    verifyActiveDot(gallery, container, dots, data ['spacing'], element);
                });
            });
        }
        else gallery.removeChild(dots);

        // Adiciona Listeners
        left.addEventListener('click', () => {
            moveLeft(gallery, container, dots, data );
        });
        right.addEventListener('click', () => {
            moveRight(gallery, container, dots, data );
        });

        mouseSlider(gallery, container, dots, data ['spacing']);

        // Auto Play 
        if(data ['auto'] == 'yes') {
            if(gallery.getAttribute('data-timeplay') == null) gallery.setAttribute('data-timeplay', '10');
            autoPlay(gallery, container, dots, data );
        }
    });

    // Eventos
    function moveLeft(gallery, container, dots, data) {
        if(container.scrollLeft == 0) container.scrollLeft = data['totalWidth'];
        else container.scrollLeft -= data['childrenWidth'] + data['spacing'];        

        verifyActiveDot(gallery, container, dots, data['spacing']);

        
        if(data['auto'] == 'yes') {
            autoPlay(gallery, container, dots, data);
        }
    }

    function moveRight(gallery, container, dots, data) {
        if((container.scrollLeft + gallery.scrollWidth) + (data['spacing']*2) >= container.scrollWidth) container.scrollLeft = 0;        
        else container.scrollLeft += data['childrenWidth'] + data['spacing'];        

        verifyActiveDot(gallery, container, dots, data['spacing']);

        if(data['auto'] == 'yes') {
            autoPlay(gallery, container, dots, data);
        }

    }

    function autoPlay(gallery, container, dots, data){
        if(!gallery.isChanging) {
            clearTimeout(gallery.galleryAutoPlay);
            
            gallery.addEventListener('mouseover', () => {
                clearTimeout(gallery.galleryAutoPlay);
            });

            gallery.galleryAutoPlay =  setTimeout(() => {
                return  moveRight(gallery, container, dots, data);
            }, Number(gallery.getAttribute('data-timeplay')) * 1000);

            gallery.addEventListener('mouseleave', () => {
                gallery.galleryAutoPlay =  setTimeout(() => {
                    return  moveRight(gallery, container, dots, data);
                }, Number(gallery.getAttribute('data-timeplay')) * 1000);
            });

            gallery.isChanging = true;    

            setTimeout(() => {
            gallery.isChanging = false;
            }, 500); 
        }
    }

    // Mouse slider
    function mouseSlider(container, element, dots, spacing) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let items = element.querySelectorAll('.item');

        if(!isMobile) {
            element.addEventListener('mousedown', e => {
                isDown = true;
                element.classList.add('slider');
                startX = e.pageX - element.offsetLeft; // Define local do click no eixo X
                scrollLeft = element.scrollLeft;      // Define o local do scroll  
                
            });
            element.addEventListener('mouseup', e => {
                isDown = false;
                element.classList.remove('slider');   
                items[0].style.marginLeft = '0px';
                items[items.length - 1].style.marginRight = '0px';
    
                // Impede que links funcionem se mouse estiver em movimento
                if(startX != e.pageX - element.offsetLeft){
                    items.forEach(el => {
                        el.querySelectorAll('a').forEach(e => {
                            e.addEventListener('click', preventEvent);
                        });
                    })
    
                    // Executa o SNAP que da erro apenas com CSS em todos navegadores
                    for(let i = 0; i <= items.length; i++){
                        let position = ((items[0].scrollWidth * (i + 1)) + (items[0].scrollWidth / 2)) + (Number(container.getAttribute('data-spacing') * (i + 1)));
                        
                        if(element.scrollLeft < (items[0].scrollWidth / 2)){
                            element.scrollLeft = 0;
                            break;
                        }
                        if(element.scrollLeft < position){
                            element.scrollLeft = position - (items[0].scrollWidth / 2);
                            break;
                        }
                    }
                }
                else {
                    items.forEach(el => {
                    el.querySelectorAll('a').forEach(e => {
                        e.removeEventListener('click', preventEvent);
                        });
                    });
            }
            
            });
            element.addEventListener('mousemove', e => {
                if(!isDown) return; // Parar de executar se for false
                e.preventDefault();
                const x = e.pageX - element.offsetLeft; // Define local onde click foi solto
                const walk = (x - startX);              // Distancia a percorer, aumentar a velocida com * N
                element.scrollLeft = scrollLeft - walk; // Movimenta scroll do elemento
                
                if(element.scrollLeft == 0 && startX < x) {
                items[0].style.marginLeft = '20px';
                }
                if(element.scrollLeft == element.scrollWidth - element.clientWidth && startX > x){
                    items[items.length - 1].style.marginRight = '20px';
                }
    
                verifyActiveDot(container, element, dots, spacing); 
            });
        }
        else {
            element.addEventListener('touchstart', e => {
                isDown = true;
                element.classList.add('slider');
                startX = e.changedTouches[0].pageX - element.offsetLeft; // Define local do click no eixo X
                scrollLeft = element.scrollLeft;                        // Define a local do scroll 
                
            });
            element.addEventListener('touchend', e => {
                isDown = false;
                element.classList.remove('slider');   
                items[0].style.marginLeft = '0px';
                items[items.length - 1].style.marginRight = '0px';
    
                // Impede que links funcionem se mouse estiver em movimento
                if(startX != e.pageX - element.offsetLeft){
                    items.forEach(el => {
                        el.querySelectorAll('a').forEach(e => {
                            e.addEventListener('click', preventEvent);
                        });
                    })
    
                    // Executa o SNAP que da erro apenas com CSS em todos navegadores
                    for(let i = 0; i <= items.length; i++){
                        let position = ((items[0].scrollWidth * (i + 1)) + (items[0].scrollWidth / 2)) + (Number(container.getAttribute('data-spacing') * (i + 1)));
                        
                        if(element.scrollLeft < (items[0].scrollWidth / 2)){
                            element.scrollLeft = 0;
                            break;
                        }
                        if(element.scrollLeft < position){
                            element.scrollLeft = position - (items[0].scrollWidth / 2);
                            break;
                        }
                    }
                }
                else {
                    items.forEach(el => {
                    el.querySelectorAll('a').forEach(e => {
                        e.removeEventListener('click', preventEvent);
                        });
                    });
            }
            
            });
            element.addEventListener('touchmove', e => {
                if(!isDown) return; // Parar de executar se for false
                e.preventDefault();
                const x = e.changedTouches[0].pageX - element.offsetLeft; // Define local onde click foi solto
                element.scrollLeft = scrollLeft - (x - startX);         // Movimenta scroll do elemento
                
                if(element.scrollLeft == 0 && startX < x) {
                items[0].style.marginLeft = '20px';
                }
                if(element.scrollLeft == element.scrollWidth - element.clientWidth && startX > x){
                    items[items.length - 1].style.marginRight = '20px';
                }
    
                verifyActiveDot(container, element, dots, spacing); 
            });
        }
                
        
    }

    //Verificar dots que vai "acender"
    function  verifyActiveDot(gallery, container, items, spacing, element){
        let last = false;
        let pass = false;
        setTimeout( () => { 
            items.childNodes.forEach(e => {
                let location = Number(e.getAttribute('data-location'));            
                let index = Number(e.getAttribute('rel'));

                if(element != null){
                    let elLoc = Number(element.getAttribute('data-location'));
                    element.classList.add('active');
                    if(elLoc == location) container.scrollLeft = elLoc + (spacing * index);
                    else e.classList.remove('active');
                }
                else {
                    if(!pass && (container.scrollLeft + gallery.scrollWidth) + (spacing * 2) >= container.scrollWidth){  
                        e.classList.remove('active')
                        last = true;
                        pass = true;
                    }
                    else if(!pass && container.scrollLeft <= (gallery.scrollWidth * index) && container.scrollLeft >= location){
                        e.classList.add('active'); 
                        pass = true;                    
                    }
                    else {
                        if(last && index == items.childNodes.length){
                            items.childNodes[items.childNodes.length - 1].classList.add('active'); 
                        }
                        else e.classList.remove('active');                    
                    }
                }
            });
        }, 500);
    }

    // O método preventDefault foi colocado em um função para ser removido facilmente
    function preventEvent(element){    
        element.preventDefault();
    }
})();