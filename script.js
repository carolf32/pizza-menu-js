const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);
let modalQt = 1;
let modalKey = 0;
let cart = [];
let discount = 0;

//mapeamento dos tamanhos
const sizeMap = {
  "320g": "S",
  "530g": "M",
  "860g": "L",
};

//Função pra fechar modal
const closeModal = () => {
  c(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    c(".pizzaWindowArea").style.display = "none";
  }, 200);
};

//Evento fechamento de modal
cs(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);

// Atualizar o preço no modal conforme quantidade
const updateModalPrice = () => {
  let price =
    pizzaJson[modalKey].price[
      c(".pizzaInfo--size.selected").getAttribute("data-key")
    ];
  c(".pizzaInfo--actualPrice").innerHTML = `$ ${price * modalQt}`;
};

//Evento aumentar e diminuir quantidade
c(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    c(".pizzaInfo--qt").innerHTML = modalQt;
    updateModalPrice();
  }
});
c(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  c(".pizzaInfo--qt").innerHTML = modalQt;
  updateModalPrice();
});

//calcular quantidade total de pizzas no icone de carrinho
const cartSum = () => {
  let total = cart.reduce((sum, item) => sum + item.qt, 0);
  c(".menu-openner span").innerHTML = total;
};

//evento de abrir e fechar carrinho ao clicar no icone de carrinho
c(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    c("aside").style.left = "0";
  }
});

c(".menu-closer").addEventListener("click", () => {
  c("aside").style.left = "100vw";
});

//calcular valor total no carrinho
const calculateTotal = () => {
  let subtotal = cart.reduce((acc, cur) => {
    let pizzaItem = pizzaJson.find((pizza) => pizza.id === cur.id);
    let price = pizzaItem.price[cur.size];
    return acc + price * cur.qt;
  }, 0);

  let total = subtotal - subtotal * discount;

  c(".cart--totalitem.subtotal span:last-child").innerHTML = `$ ${subtotal}`;
  c(".cart--totalitem.desconto span:last-child").innerHTML = `$ ${(
    discount * subtotal
  ).toFixed(1)}`;

  c(".price").innerHTML = `$ ${total}`;
};

//aplicar desconto
const btn = c(".cart--applyDiscount");
const field = c(".cart--discountArea-input");
btn.addEventListener("click", () => {
  if (field.value === "#first") {
    c(".cart--totalitem.subtotal").style.display = "flex";
    c(".cart--totalitem.desconto").style.display = "flex";
    discount = 0.1;
    calculateTotal();
  }
});

//atualiza carrinho lateral
const updateCart = () => {
  c(".cart").innerHTML = "";

  if (cart.length > 0) {
    c("aside").classList.add("show");

    cart.forEach((cartItem, index) => {
      let pizzaItem = pizzaJson.find((item) => item.id == cartItem.id);
      let cartItemElement = c(".models .cart--item").cloneNode(true);

      cartItemElement.querySelector(".cart--item img").src = pizzaItem.img;

      let sizeName = sizeMap[pizzaItem.sizes[cartItem.size]];
      cartItemElement.querySelector(
        ".cart--item-nome"
      ).innerHTML = `${pizzaItem.name} (${sizeName})`;

      cartItemElement.querySelector(".cart--item--qt").innerHTML = cartItem.qt;

      cartItemElement
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cartItem.qt > 1) {
            cartItem.qt--;
          } else {
            cart.splice(index, 1);
          }
          updateCart();
          cartSum();
          calculateTotal();
        });

      cartItemElement
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cartItem.qt++;
          updateCart();
          cartSum();
          calculateTotal();
        });
      c(".cart").append(cartItemElement);

      calculateTotal();
    });
  } else {
    c("aside").classList.remove("show");
    c("aside").style.left = "100vw";
  }
};

//botão de adicionar ao carrinho
c(".pizzaInfo--addButton").addEventListener("click", () => {
  let size = c(".pizzaInfo--size.selected").getAttribute("data-key");

  cart.push({
    id: pizzaJson[modalKey].id,
    size,
    qt: modalQt,
  });
  cartSum();
  updateCart();
  closeModal();
});

//Listagem das pizzas
pizzaJson.map((item, index) => {
  let pizzaItem = c(".models .pizza-item").cloneNode(true);

  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

  pizzaItem.querySelector(".pizza-item--img img").src = item.img;

  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    modalKey = index;
    modalQt = 1;

    c(".pizzaWindowArea").style.display = "flex";

    c(".pizzaBig img").src = pizzaJson[index].img;
    c(".pizzaInfo h1").innerHTML = pizzaJson[index].name;
    c(".pizzaInfo--desc").innerHTML = pizzaJson[index].description;
    c(".pizzaInfo--qt").innerHTML = modalQt;

    //resetar informações de tamanho e preço
    cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
      size.classList.remove("selected");
      if (sizeIndex === 0) {
        size.classList.add("selected");
        c(
          ".pizzaInfo--actualPrice"
        ).innerHTML = `$ ${pizzaJson[index].price[sizeIndex]}`;
      }
    });

    //atualiza o preço conforme tamanho escolhido
    cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
      let price = pizzaJson[index].price[sizeIndex];

      size.querySelector("span").innerHTML = pizzaJson[index].sizes[sizeIndex];

      size.addEventListener("click", () => {
        c(".pizzaInfo--size.selected").classList.remove("selected");
        size.classList.add("selected");
        c(".pizzaInfo--actualPrice").innerHTML = `R$ ${price * modalQt}`;
      });
    });

    //animação do modal
    c(".pizzaWindowArea").style.opacity = 0;
    setTimeout(() => {
      c(".pizzaWindowArea").style.opacity = 1;
    }, 200);
  });

  c(".pizza-area").append(pizzaItem);
});
