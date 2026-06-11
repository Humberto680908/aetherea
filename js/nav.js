/* nav.js — estado de la barra al hacer scroll y menú móvil. */

(function(){
  const nav = document.getElementById('site-nav');
  if(!nav) return;

  function onScroll(){
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* Menú hamburguesa (móvil) */
  const burger = document.getElementById('nav-burger');
  const links = nav.querySelector('.site-nav__links');
  if(burger && links){
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Cierra el menú al elegir un destino
    links.addEventListener('click', (e) => {
      if(e.target.closest('a')){
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();
