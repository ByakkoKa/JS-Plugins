/**
 * Plugin criado por:
 * Paulo Cezario
 * https://github.com/ByakkoKa
 **/
(function() {
    // Verifica se existe popup
    const popExist = document.querySelectorAll('[rel^="showpopup"]');

    if(popExist != null) {
        // Variavel de uso global
        let popup;

        // Verifica clique
        let clicked = false;

        // Seleciona DIV contendo todas Pop-ups
        let divContainer = document.querySelector('#popup-container');
        let childrens = [];

        if(divContainer != null) {
            // Adiciona todos as childrens do container em um array
            divContainer.querySelectorAll('.popup-window').forEach(element => {
                childrens.push(element);
            });

            // Remove container do DOM antes de carregar todos as Pop-ups
            divContainer.parentNode.removeChild(divContainer);
        }

        // Captura qual objeto pode abrir um Pop-Up
        document.querySelectorAll('[rel^="showpopup"]').forEach(element => {
            let id = element.getAttribute('data-id');
            let clss = element.getAttribute('class');

            if(element.getAttribute('data-auto') == 'yes'){
                //Adiciona classe certa
                if(clss == null) element.setAttribute('class', 'popup-window');
                else element.setAttribute('class', `${clss} popup-window`);

                element.removeAttribute('rel');
                
                // Abre Pop-up automáticamente
                openPopup(id, 'yes', element);
            }
            else {
                element.addEventListener('click', () => {
                    // Busca elemento correto para abrir
                    openPopup(id, 'no');
                });
            }   
        });

        function openPopup(id, auto, el) {
            if(!clicked) {
                // Add elementos container, shadowbox e botão de fechar no body
                popup = document.createElement('div');
                popup.innerHTML = `<div class="close-popup" id="popup-shadowbox"></div><div class="close-popup" id="popup-close">×</div>`;
                popup.setAttribute('id', 'popup-show');
                document.body.appendChild(popup);
                document.body.style.overflowY = 'hidden';

                let width = popup.scrollWidth;
                let height = popup.scrollHeight;

                if(auto == 'yes'){
                    popup.appendChild(el);
                    verifySize(el, width, height);
                }
                else {
                    // Encontra children correta
                    let child = childrens.find(e => {
                        let data = e.getAttribute('data-id');
                        if(data == id) return e;
                    })

                    popup.appendChild(child);

                    verifySize(child, width, height);
                }
                

                clicked = true;

                // Apos abrir busca elementos que podem fechar a Pop-up
                document.querySelectorAll('.close-popup').forEach(element => {
                    element.addEventListener('click', () => {
                        closePopup(popup);
                    });
                }); 
            }
        }

        function closePopup(element) {
            if(clicked) {
                document.body.style.overflowY = 'auto';                
                document.body.removeChild(element);
                clicked = false;
            }
        }

        // Verificar tamanho e alinha no centro da janela
        function verifySize(element, width, height) {
            if(height < element.scrollHeight) element.style.height = '98%';
            if(width < element.scrollWidth) element.style.width = '97%';

            element.style.marginTop = `-${element.scrollHeight / 2}px`;    
            element.style.marginLeft = `-${element.scrollWidth / 2}px`;
        }

        // Detecta se tecla ESC for pressionada e fecha janela 
        document.onkeydown = function(evt) {
            evt = evt || window.event;
            if (evt.code == 'Escape' && clicked) {
                closePopup(popup);
            }
        }
    }
})();
