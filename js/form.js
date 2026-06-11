/* form.js — formulario de agenda.
   - Valida los campos obligatorios.
   - Si AETHEREA_CONFIG.formEndpoint está configurado (Formspree),
     envía de verdad; si no, simula el envío (modo demo).
   - Expone window.prefillBooking() para que la calculadora de signo,
     el modal del zodiaco y las fases lunares lleguen con el formulario
     ya preparado. */

(function(){
  const form = document.getElementById('booking-form');
  const success = document.getElementById('booking-success');
  const errorMsg = document.getElementById('form-error');
  if(!form) return;

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const lang = () => document.documentElement.lang === 'en' ? 'en' : 'es';

  /* Pre-rellena el formulario y hace scroll hasta él.
     Lo usan los CTAs contextuales (modal del signo, fases, calculadora). */
  window.prefillBooking = function(data){
    if(data.lectura) form.elements.lectura.value = data.lectura;
    if(data.mensaje) form.elements.mensaje.value = data.mensaje;
    if(data.email) form.elements.email.value = data.email;
    if(data.nacimiento) form.elements.nacimiento.value = data.nacimiento;
    document.getElementById('reservar').scrollIntoView({behavior:'smooth'});
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;
    form.querySelectorAll('.form-field').forEach(f => f.classList.remove('is-invalid'));

    const markInvalid = (field) => {
      field.closest('.form-field').classList.add('is-invalid');
      valid = false;
    };

    const nombre = form.elements.nombre;
    const email = form.elements.email;
    const nacimiento = form.elements.nacimiento;
    const lectura = form.elements.lectura;

    if(!nombre.value.trim()) markInvalid(nombre);
    if(!isEmail(email.value.trim())) markInvalid(email);
    if(!nacimiento.value) markInvalid(nacimiento);
    if(!lectura.value) markInvalid(lectura);

    errorMsg.hidden = valid;
    if(!valid) return;

    const button = form.querySelector('button[type="submit"]');
    const endpoint = (typeof AETHEREA_CONFIG !== 'undefined' && AETHEREA_CONFIG.formEndpoint) || '';

    if(endpoint){
      button.disabled = true;
      button.textContent = lang() === 'en' ? 'Sending…' : 'Enviando…';
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {Accept: 'application/json'},
          body: new FormData(form)
        });
        if(!res.ok) throw new Error('HTTP ' + res.status);
      } catch(err){
        button.disabled = false;
        button.innerHTML = button.getAttribute('data-' + lang());
        errorMsg.innerHTML = lang() === 'en'
          ? 'Something went wrong while sending. Please try again in a minute.'
          : 'Algo falló al enviar. Inténtalo de nuevo en un minuto.';
        errorMsg.hidden = false;
        return;
      }
    }

    form.hidden = true;
    success.hidden = false;
  });
})();
