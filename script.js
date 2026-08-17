const products = [
  {id:1,name:"UNCOMMON TEE 01",color:"WHITE",price:0},
  {id:2,name:"UNCOMMON TEE 02",color:"WHITE",price:0},
  {id:3,name:"UNCOMMON TEE 03",color:"NAVY",price:0},
  {id:4,name:"UNCOMMON TEE 04",color:"NAVY",price:0}
];
let cart = JSON.parse(localStorage.getItem("uncommon_cart") || "[]");

const productsEl = document.getElementById("products");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const checkoutModal = document.getElementById("checkoutModal");

function money(n){ return `EGP ${Number(n).toLocaleString()}`; }

function renderProducts(){
  productsEl.innerHTML = products.map(p => `
    <article class="product">
      <div class="product-visual"></div>
      <div class="product-info">
        <div>
          <div class="product-name">${p.name}</div>
          <div class="product-meta">${p.color} / OVERSIZED</div>
          <button onclick="addToCart(${p.id})">ADD TO CART</button>
        </div>
        <div class="price">${p.price ? money(p.price) : "PRICE TBC"}</div>
      </div>
    </article>`).join("");
}
function addToCart(id){
  const p=products.find(x=>x.id===id);
  const item=cart.find(x=>x.id===id);
  if(item) item.qty++; else cart.push({...p,qty:1});
  saveCart(); openCart();
}
function removeFromCart(id){
  cart=cart.filter(x=>x.id!==id); saveCart(); renderCart();
}
function saveCart(){
  localStorage.setItem("uncommon_cart",JSON.stringify(cart)); renderCart();
}
function renderCart(){
  document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  const items=document.getElementById("cartItems");
  items.innerHTML=cart.length ? cart.map(x=>`
    <div class="cart-item">
      <div><strong>${x.name}</strong><small>${x.color} / QTY ${x.qty}</small></div>
      <div>${x.price ? money(x.price*x.qty) : "TBC"}<br><button onclick="removeFromCart(${x.id})">REMOVE</button></div>
    </div>`).join("") : `<p style="color:#666;font:11px 'DM Mono'">YOUR CART IS EMPTY.</p>`;
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  document.getElementById("cartTotal").textContent=total ? money(total) : "TBC";
}
function openCart(){cartDrawer.classList.add("open");overlay.classList.add("open");cartDrawer.setAttribute("aria-hidden","false")}
function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("open");cartDrawer.setAttribute("aria-hidden","true")}
document.getElementById("openCart").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
overlay.onclick=closeCart;

document.getElementById("checkoutBtn").onclick=()=>{
  if(!cart.length) return;
  closeCart(); checkoutModal.classList.add("open");
};
document.getElementById("closeCheckout").onclick=()=>checkoutModal.classList.remove("open");

document.getElementById("checkoutForm").onsubmit=(e)=>{
  e.preventDefault();
  alert("Prototype order received. In the next stage this will create a real order in the database and trigger Bosta/Meta integrations.");
  checkoutModal.classList.remove("open");
};

renderProducts(); renderCart();
