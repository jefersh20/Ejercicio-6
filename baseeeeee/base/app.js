const container = document.querySelector("#contenedor");
const modalBody = document.querySelector(".modal .modal-body");

const containerShoppingCart = document.querySelector("#carritoContenedor");
const removeAllProductsCart = document.querySelector("#vaciarCarrito");

const keepBuy = document.querySelector("#procesarCompra");
const totalPrice = document.querySelector("#precioTotal");

const activeFunction = document.querySelector("#activarFuncion");

const fakeStoreApi = "https://fakestoreapi.com/products";



const ordenarBtn = document.querySelector("#ordenarBtn");

ordenarBtn.addEventListener("click", () => {
    // Ordena los productos por precio ascendente
    shoppingCart.sort((a, b) => a.price - b.price);
    
    // Muestra los productos ordenados
    showShoppingCart();
});


const abrirFormularioBtn = document.querySelector("#abrirFormulario");
const formulario = document.querySelector("#formulario");
const nuevoProductoForm = document.querySelector("#nuevoProductoForm");

abrirFormularioBtn.addEventListener("click", () => {
  formulario.style.display = "block";
});

nuevoProductoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombreProducto = document.querySelector("#nombreProducto").value;
  const precioProducto = parseFloat(document.querySelector("#precioProducto").value);
  const imagenProducto = document.querySelector("#imagenProducto").value;
  const descripcionProducto = document.querySelector("#descripcionProducto").value;

  // Validación básica
  if (!nombreProducto || isNaN(precioProducto) || !imagenProducto || !descripcionProducto) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  // Aquí puedes agregar el nuevo producto a tu catálogo o enviar los datos a tu servidor, según tu lógica.
  const nuevoProducto = {
    title: nombreProducto,
    price: precioProducto,
    image: imagenProducto,
    description: descripcionProducto,
  };

  // Puedes agregar el nuevo producto a la lista de productos existente.
  productList.push(nuevoProducto);

  // Limpia el formulario
  nuevoProductoForm.reset();

  // Cierra el formulario
  formulario.style.display = "none";

  // Actualiza el catálogo o realiza las acciones necesarias para reflejar el nuevo producto.
  // Por ejemplo, podrías llamar a una función para mostrar los productos actualizados.
  mostrarProductosActualizados();
});

//empieza



//definimos un arreglo para guardar los productos que se agreguen al carrito
let shoppingCart = [];

//definimos un arreglo para guardar la lista de productos
let productList = [];

//definimos un contador para saber cuantos productos se agregan al carrito
let counter = 0;
// definimos un arreglo para guardar la cantidad de productos
let quantity = [];

// soticitar y agregar al contenedor
const fetchProducts = async () => {
  try {
    const response = await fetch(fakeStoreApi);
    if (!response.ok) {
      throw new Error("no se pudo conectar");
    }

    return await response.json();
  } catch (error) {
    console.log(error.message);
  }
};

const addProductsContainer = (product) => {
  const { id, title, image, price, description } = product;
  container.innerHTML += `
  <div class="card mt-3" style="width: 18rem;">
  <img class="card-img-top mt-2" src="${image}" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text" style="font-weight: bold">$ ${price}</p>
      <p class="card-text">• ${description}</p>
      <button class="btn btn-primary" onclick="addProduct(${id})">Comprar producto</button>
    </div>
  </div>
  `;
};


//Aqui comienza

const editProduct = (id) => {
  // Encuentra el producto en productList por su ID
  const productToEdit = productList.find((item) => item.id === id);

  // Rellena el formulario de edición con los detalles del producto
  document.querySelector("#nombreProducto").value = productToEdit.title;
  document.querySelector("#precioProducto").value = productToEdit.price;
  document.querySelector("#imagenProducto").value = productToEdit.image;
  document.querySelector("#descripcionProducto").value = productToEdit.description;

  // Define una función para guardar los cambios
  const saveChanges = () => {
    const editedProduct = {
      ...productToEdit,
      title: document.querySelector("#nombreProducto").value,
      price: parseFloat(document.querySelector("#precioProducto").value),
      image: document.querySelector("#imagenProducto").value,
      description: document.querySelector("#descripcionProducto").value,
    };

    // Encuentra el índice del producto en productList
    const index = productList.findIndex((item) => item.id === id);

    // Reemplaza el producto editado en la lista
    productList[index] = editedProduct;

    // Limpia el formulario y oculta el formulario de edición
    nuevoProductoForm.reset();
    formulario.style.display = "none";

    // Actualiza la vista del catálogo
    mostrarProductosActualizados();
  };

  // Asocia la función de guardar cambios al botón de "Guardar cambios"
  document.querySelector("#nuevoProductoForm").addEventListener("submit", (e) => {
    e.preventDefault();
    saveChanges();
  });
};

const removeProduct = (id) => {
  // Filtra los productos para eliminar el que tenga el ID especificado
  productList = productList.filter((item) => item.id !== id);

  // Actualiza la vista del catálogo
  mostrarProductosActualizados();
};








//parte de realizacion


const getProducts = async () => {
  const products = await fetchProducts();
  productList = products;
  filterByCategory("all"); // Aplica el filtro de inmediato cuando cargas los productos.
};

// agregando productos al carrito

const addProduct = (id) => {
  const testProductId = shoppingCart.some((item) => item.id === id);

  if (testProductId) {
    Swal.fire({
      title: "Este chunche ya fue seleccionado",
      text: "Por favor seleccione otra cosa",
      icon: "success",
    });
    return;
  }

  shoppingCart.push({
    ...productList.find((item) => item.id === id),
    quantity: 1,
  });

  showShoppingCart();
};

// carrito de compras

const showShoppingCart = () => {
  modalBody.innerHTML = "";

  shoppingCart.forEach((product) => {
    const { title, image, price, id } = product;

    modalBody.innerHTML += `
      <div class="modal-contenedor">
        <div>
          <img class="img-fluid img-carrito" src="${image}"/>
        </div>
        <div>
          <p style="font-weight: bold">${title}</p>
          <p style="font-weight: bold">Precio: R$ ${price}</p>
          <div>
            <button onclick="removeProducts(${id})" class="btn btn-danger">Eliminar produto</button>
          </div>
        </div>
      </div>
    `;
  });

  totalPriceInCart(totalPrice);
  messageEmptyShoppingCart();
  containerShoppingCart.textContent = shoppingCart.length;
  setItemInLocalStorage();
};

//quitar productos del carrito

const removeProducts = (id) => {
  const index = shoppingCart.findIndex((item) => item.id === id);

  if (index !== -1) {
    shoppingCart.splice(index, 1);
    showShoppingCart();
  }
};

// vaciar carrito de compras

removeAllProductsCart.addEventListener("click", () => {
  shoppingCart.length = [];
  showShoppingCart();
});

// mensagem carrinho vazio
const messageEmptyShoppingCart = () => {
  if (shoppingCart.length === 0) {
    modalBody.innerHTML = `
      <p class="text-center text-primary parrafo">No hay nada en el carrito!</p>
    `;
  }
};

// continuar comprando

keepBuy.addEventListener("click", () => {
  if (shoppingCart.length === 0) {
    Swal.fire({
      title: "su carrito está vacío",
      text: "Compre algo para continuar",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  } else {
    location.href = "index.html";
    finalOrder();
  }
});

// precio total en el carrito
const totalPriceInCart = (totalPriceCart) => {
  totalPriceCart.innerText = shoppingCart.reduce((acc, prod) => {
    return acc + prod.price;
  }, 0);
};

// local storage
const setItemInLocalStorage = () => {
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
};
const categoryFilter = document.querySelector("#categoryFilter");

categoryFilter.addEventListener("change", function () {
  const selectedCategory = this.value;
  filterByCategory(selectedCategory);
});

function filterByCategory(category) {
  if (category === "all") {
    productList.forEach(addProductsContainer); // Si la categoría es 'all', simplemente mostramos todos los productos.
  } else {
    const filteredProducts = productList.filter(
      (product) => product.category === category
    ); // Filtramos productos según la categoría seleccionada.
    container.innerHTML = ""; // Limpiamos el contenedor.
    filteredProducts.forEach(addProductsContainer); // Agregamos los productos filtrados al contenedor.
  }
}

const addItemInLocalStorage = () => {
  shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  setItemInLocalStorage();
  showShoppingCart();
};

document.addEventListener("DOMContentLoaded", addItemInLocalStorage);
getProducts();
