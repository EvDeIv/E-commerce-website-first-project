const productImages = document.querySelectorAll(".product-images img");
const productImagesSlide = document.querySelector(".image-slider");

let achiveImageSlide = 0;

productImages.forEach((item, i) => {
  item.addEventListener("click", () => {
    productImages[achiveImageSlide].classList.remove("active");
    item.classList.add("active");
    productImagesSlide.style.backgroundImage = `url('${item.src}')`;
    achiveImageSlide = i;
  });
});

const sizeBtns = document.querySelectorAll(".size-radio-btn");
let checkedBtn = 0;
let size;

sizeBtns.forEach((item, i) => {
  item.addEventListener("click", () => {
    sizeBtns[checkedBtn].classList.remove("check");
    item.classList.add("check");
    checkedBtn = i;
    size = item.innerHTML;
  });
});

//set up data
const setData = (data) => {
  let titile = document.querySelector("title");

  //set up images
  productImages.forEach((img, i) => {
    if (data.images[i]) {
      img.src = data.images[i];
    } else {
      img.style.display = "none";
    }
  });
  productImages[0].click();

  //set up size buttons
  sizeBtns.forEach((item) => {
    if (!data.sizes.includes(item.innerHTML)) {
      item.style.display = "none";
    }
  });

  //set up texts
  const name = document.querySelector(".product-brand");
  const shortDes = document.querySelector(".product-short-des");
  const des = document.querySelector(".des");

  titile.innerHTML += name.innerHTML = data.name;
  shortDes.innerHTML = data.shortDes;
  des.innerHTML = data.des;

  //pricing
  const sellingPrice = document.querySelector(".product-price");
  const actualPrice = document.querySelector(".product-actual-price");
  const discount = document.querySelector(".product-discount");

  sellingPrice.innerHTML = `$${data.sellingPrice}`;
  actualPrice.innerHTML = `$${data.actualPrice}`;
  discount.innerHTML = `(${data.discount}% off)`;

  // wishlist and cart btn
  const wishlistBtn = document.querySelector(".wishlist-btn");
  wishlistBtn.addEventListener("click", () => {
    wishlistBtn.innerHTML = add_product_to_cart_or_wishlist("wishlist", data);
  });

  const cartBtn = document.querySelector(".cart-btn");
  cartBtn.addEventListener("click", () => {
    cartBtn.innerHTML = add_product_to_cart_or_wishlist("cart", data);
  });
};

//fetch data
const fetchProductInfo = () => {
  fetch("/get-products", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ id: productId }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      setData(data);
      getProducts(data.tags[0]).then((data) => {
        createProductSlider(
          data,
          ".container-for-card-slider",
          "similar products"
        );
      });
    })
    .catch((err) => {
      console.log(err);
      // location.replace("/404");
    });
};

let productId = null;
if (location.pathname != "/products") {
  productId = decodeURI(location.pathname.split("/").pop());
  fetchProductInfo();
}
