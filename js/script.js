const requestURL =
  "https://gist.githubusercontent.com/jhonatan89/719f8a95a8dce961597f04b3ce37f97b/raw/4b7f1ac723a14b372ba6899ce63dbd7c2679e345/products-ecommerce";

let items = [];
let favoritos = [];

const getJson = async () => {
  return fetch(requestURL)
    .then((response) => response.json())
    .then((data) => data);
};

const poblarElectrodomesticos = async () => {
  let data = await getJson();
  items = data.items;
  poblarTabla(items);
};
function reload() {
  poblarTabla(items);
}

function poblarTabla(data) {
  const table = document.getElementById("cuerpoTabla");
  cuerpoTabla.innerHTML = "";
  if (data.length < 1) {
    const myDiv2 = document.createElement("div");
    const nombre = document.createElement("p");
    nombre.className = "nombreProducto";
    nombre.textContent = "No se encontraron productos dentro de esta categoria";
    myDiv2.appendChild(nombre);
    cuerpoTabla.appendChild(myDiv2);
  } else {
    let top = 159;
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const myDiv = document.createElement("div");
      myDiv.className = "info";
      myDiv.style.top = top + "px";
      top += 221;

      const img = document.createElement("img");
      img.style.position = "absolute";
      img.style.boxSizing = " border-box";
      img.style.width = 180 + "px";
      img.style.height = "180" + "px";
      img.style.left = 44 + "px";
      img.style.top = 30 + "px";
      img.src = element.picture;
      const nuevoIndice = findWithAttr(items, element.id);
      img.setAttribute("onclick", "darDetalle(" + nuevoIndice + ")");
      myDiv.appendChild(img);

      const nombre = document.createElement("p");
      nombre.className = "nombreProducto";
      nombre.textContent = element.title;
      myDiv.appendChild(nombre);

      const ciudad = document.createElement("p");
      ciudad.className = "ciudad";
      ciudad.textContent = element.location;

      myDiv.appendChild(ciudad);

      const precio = document.createElement("p");
      precio.className = "precio";
      precio.textContent = formatter.format(element.price.amount);

      myDiv.appendChild(precio);

      const shipping = document.createElement("img");
      if (element.free_shipping) {
        shipping.style.position = "absolute";
        shipping.style.boxSizing = " border-box";
        shipping.style.width = 20 + "px";
        shipping.style.height = 20 + "px";
        shipping.alt = "Free shipping available";
        shipping.style.left = 498 + "px";
        shipping.style.top = 34 + "px";
        shipping.src = "/img/shipping.png";
        myDiv.appendChild(shipping);
      }

      table.appendChild(myDiv);
    }
  }
}
poblarElectrodomesticos();

function filtrar() {
  let lista = items;
  const categoria = document.getElementById("searchBar").value;
  console.log(categoria);
  const filtrado = lista.filter(
    (item) => item.categories.indexOf(categoria) > -1,
  );
  poblarTabla(filtrado);
}

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

function darDetalle(producto) {
  const table = document.getElementById("cuerpoTabla");
  cuerpoTabla.innerHTML = "";
  const detalle = items[producto];
  const myDiv = document.createElement("div");
  myDiv.className = "detalle";

  const img = document.createElement("img");
  img.className = "imgDetalle";
  img.src = detalle.picture;
  myDiv.appendChild(img);

  const titulo = document.createElement("p");
  titulo.className = "tituloProd";
  titulo.textContent = "Descripción del producto";
  myDiv.appendChild(titulo);

  const descripcion = document.createElement("p");
  descripcion.className = "descripcion";
  descripcion.textContent = detalle.description;
  myDiv.appendChild(descripcion);

  const usado = document.createElement("p");
  usado.className = "usado";
  let textUsado = "Usado|" + detalle.sold_quantity + " Vendidos";
  if (detalle.condition) {
    textUsado = "Nuevo|" + detalle.sold_quantity + " Vendidos";
  }
  usado.textContent = textUsado;
  myDiv.appendChild(usado);

  const nombre = document.createElement("p");
  nombre.className = "tituloDetalle";
  nombre.textContent = detalle.title;
  myDiv.appendChild(nombre);

  const precio = document.createElement("p");
  precio.className = "precioDetalle";
  precio.textContent = formatter.format(detalle.price.amount);
  myDiv.appendChild(precio);

  const comprar = document.createElement("button");
  comprar.className = "comprar";
  comprar.type = "button";
  comprar.textContent = "Comprar";
  comprar.setAttribute("onclick", "comprar(" + producto + ")");
  comprar.setAttribute("data-bs-toggle", "modal");
  comprar.setAttribute("data-bs-target", "#exampleModal");
  myDiv.appendChild(comprar);

  const favorito = document.createElement("button");
  favorito.className = "favoritoBut";
  favorito.type = "button";
  const str = favoritos.includes(detalle)
    ? "Eliminar de favoritos"
    : "Añadir a favoritos";
  favorito.textContent = str;
  console.log(favoritos.includes(detalle));
  if (str == "Añadir a favoritos") {
    favorito.setAttribute("onclick", "agregarFav(" + producto + ")");
  } else {
    favorito.setAttribute("onclick", "eliminarFav(" + producto + ")");
  }
  myDiv.appendChild(favorito);

  const bread = document.createElement("nav");
  bread.arialabel = "breadcrumb";
  bread.id = "breado";
  bread.className = "bread ";
  const lista = document.createElement("ol");
  lista.className = "breadcrumb breadcrumb-dot";
  detalle.categories.forEach((element) => {
    const el = document.createElement("li");
    el.className = "breadcrumb-item";
    const cat = document.createElement("a");
    cat.textContent = element;
    el.appendChild(cat);
    lista.appendChild(el);
  });

  bread.appendChild(lista);
  myDiv.appendChild(bread);

  table.appendChild(myDiv);
}

function comprar(producto) {
  const contenido = document.getElementById("contenidoModal");
  contenido.innerHTML = "";
  const nombre = document.createElement("p");
  nombre.className = "tituloModal";
  nombre.textContent = items[producto].title;
  contenido.appendChild(nombre);
  const anuncio = document.createElement("p");
  anuncio.className = "anuncioModal";
  anuncio.textContent = "Añadido al carrito de compras";
  contenido.appendChild(anuncio);
}

function agregarFav(producto) {
  favoritos.push(items[producto]);
  console.log(items[producto]);
  darDetalle(producto);
}

function darFavoritos() {
  const table = document.getElementById("cuerpoTabla");
  cuerpoTabla.innerHTML = "";
  const titulo = document.createElement("p");
  titulo.className = "favoritoTitulo";
  titulo.textContent = "Favoritos";
  const header = document.createElement("p");
  header.className = "headerFavoritos";
  table.appendChild(header);
  const check = document.createElement("div");
  check.className = "form-check cajitaCheck";
  const caja = document.createElement("input");
  caja.setAttribute("onclick", "toggle(this)");
  caja.className = "form-check-input";
  caja.type = "checkbox";
  caja.value = "";
  caja.id = "flexCheckDefault";
  check.appendChild(caja);
  header.appendChild(check);
  const eliminar = document.createElement("button");
  eliminar.className = "eliminar";
  eliminar.type = "button";
  eliminar.textContent = "Eliminar";
  eliminar.setAttribute("onclick", "eliminar()");
  header.appendChild(eliminar);
  table.appendChild(titulo);

  let top = 252;
  for (let index = 0; index < favoritos.length; index++) {
    const element = favoritos[index];
    const myDiv = document.createElement("div");
    myDiv.className = "info";
    myDiv.style.top = top + "px";
    top += 219;

    const img = document.createElement("img");
    img.style.position = "absolute";
    img.style.boxSizing = " border-box";
    img.style.width = 180 + "px";
    img.style.height = "180" + "px";
    img.style.left = 44 + "px";
    img.style.top = 30 + "px";
    img.src = element.picture;
    myDiv.appendChild(img);

    const check1 = document.createElement("div");
    check1.className = "form-check cajitaCheck2";
    const caja1 = document.createElement("input");
    caja1.name = "foo";
    caja1.className = "form-check-input";
    caja1.type = "checkbox";
    caja1.value = "";
    caja1.id = "flexCheckDefault";
    check1.appendChild(caja1);
    myDiv.appendChild(check1);

    const nombre = document.createElement("p");
    nombre.className = "nombreProducto";
    nombre.textContent = element.title;
    myDiv.appendChild(nombre);

    const precio = document.createElement("p");
    precio.className = "precio";
    precio.textContent = formatter.format(element.price.amount);

    const favorito = document.createElement("button");
    favorito.className = "VerDetalles";
    favorito.type = "button";
    favorito.textContent = "Ver Articulo";
    const nuevoIndice = findWithAttr(items, element.id);
    favorito.setAttribute("onclick", "darDetalle(" + nuevoIndice + ")");
    myDiv.appendChild(favorito);

    myDiv.appendChild(precio);

    const shipping = document.createElement("img");
    if (element.free_shipping) {
      shipping.style.position = "absolute";
      shipping.style.boxSizing = " border-box";
      shipping.style.width = 20 + "px";
      shipping.style.height = 20 + "px";
      shipping.alt = "Free shipping available";
      shipping.style.left = 498 + "px";
      shipping.style.top = 34 + "px";
      shipping.src = "/img/shipping.png";
      myDiv.appendChild(shipping);
    }

    table.appendChild(myDiv);
  }
}

function toggle(source) {
  checkboxes = document.getElementsByName("foo");
  for (var i = 0, n = checkboxes.length; i < n; i++) {
    checkboxes[i].checked = source.checked;
  }
}

function eliminar() {
  checkboxes = document.getElementsByName("foo");
  for (var i = 0, n = checkboxes.length; i < n; i++) {
    if (favoritos.length == 1) {
      favoritos = [];
    } else {
      if (checkboxes[i].checked) {
        favoritos.splice(i, 1);
      }
    }
  }
  darFavoritos();
}
function findWithAttr(array, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i].id === value) {
      return i;
    }
  }
  return -1;
}

function eliminarFav(producto) {
  if (favoritos.length == 1) {
    favoritos = [];
  } else {
    favoritos.splice(favoritos.indexOf(producto), 1);
  }
  darDetalle(producto);
}
