/* eslint-disable no-useless-return */
const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
  formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
  e.preventDefault();
  // console.log('Buscando clima...');
  // validar info
  const ciudad = document.querySelector('#ciudad').value;
  const pais = document.querySelector('#pais').value;

  if (ciudad === '' || pais === '') {
    mostrarError('Ambos campos son obligatorios');
    return;
  }
  // console.log(ciudad);
  // console.log(pais);

  // Consultar API
  consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
  const alerta = document.querySelector('.bg-red-100');

  if (!alerta) {
    // Crear alerta
    const alerta = document.createElement('div');

    alerta.classList.add(
      'bg-red-100',
      'border-red-400',
      'text-red-700',
      'px-4',
      'py-3',
      'rounded',
      'max-w-md',
      'mx-auto',
      'mt-6',
      'text-center'
    );
    alerta.innerHTML = `
    <strong class="font-bold">Error!</strong>
    <span class="block">${mensaje}</span>
    `;

    container.appendChild(alerta);
    // Eliminar alerta despues de 5 seconds
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function consultarAPI(ciudad, pais) {
  const appId = '83ab7338f51239d9778d2b3ef1f2648b';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

  Spinner(); // Muestra spinner de carga

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      if (datos.cod === '404') {
        mostrarError('Ciudad no encontrada...');
        return;
      }
      // Mostrar la respuesta en el html
      setTimeout(() => {
        mostrarClima(datos);
      }, 3000);
      console.log(datos);
    });

  // console.log(url);
}

function mostrarClima(datos) {
  limpiarHTML();
  const {
    main: { temp, temp_max, temp_min },
    name,
    sys: { country },
  } = datos;
  const centigrados = kelvinACentigrados(temp);
  const max = kelvinACentigrados(temp_max);
  const min = kelvinACentigrados(temp_min);

  const ciudad = document.createElement('p');
  const actual = document.createElement('p');
  const tempMaxima = document.createElement('p');
  const tempMinima = document.createElement('p');

  ciudad.textContent = `Clima en: ${name} (${country})`;
  ciudad.classList.add('text-2xl', 'font-bold');

  actual.innerHTML = `${centigrados.toFixed(0)} &#8451`;
  actual.classList.add('font-bold', 'text-6xl');

  tempMaxima.innerHTML = `Maxima: ${max} &#8451`;
  tempMaxima.classList.add('text-xl');

  tempMinima.innerHTML = `Minima: ${min} &#8451`;
  tempMinima.classList.add('text-xl');

  const resultadoDiv = document.createElement('div');
  resultadoDiv.classList.add('text-center', 'text-white');
  resultadoDiv.appendChild(ciudad);
  resultadoDiv.appendChild(actual);
  resultadoDiv.appendChild(tempMaxima);
  resultadoDiv.appendChild(tempMinima);

  resultado.appendChild(resultadoDiv);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function kelvinACentigrados(grados) {
  return parseInt(grados - 273.15);
}

function Spinner() {
  limpiarHTML();
  const divSpinner = document.createElement('div');
  divSpinner.classList.add('sk-chase');

  divSpinner.innerHTML = `
  
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  `;

  resultado.appendChild(divSpinner);
}
