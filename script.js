
(function(){
  const toNGN = n => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);

  let cart = [];
  let wishlist = [];

  function render(products){
    const container = document.getElementById('product-list');
    container.innerHTML = '';
    if(!products || !products.length){
      container.innerHTML = '<p>No products yet. Check back soon!</p>';
      return;
    }
    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product';
      const imgSrc = p.image && p.image.trim() ? p.image : 'images/placeholder.png';
       card.innerHTML = `
          <img src="${imgSrc}" alt="${p.name || 'Product'}"/>
          <h3>${p.name || 'Unnamed product'}</h3>
          <p class="price">${p.price ? toNGN(p.price) : ''}</p>
          <p class="desc">${p.description || ''}</p>
          <div class="actions">
            <button class="btn primary add-cart">Add to Cart</button>
            <button class="btn secondary add-wishlist">Wishlist</button>
          </div>

        `;
      container.appendChild(card);

      // Handle product buttons
      card.querySelector('.add-cart').addEventListener('click', ()=>{
        cart.push(p);
        updateFloatingCounts();
        renderSidebarItems('cart-items', cart);
      });

      card.querySelector('.add-wishlist').addEventListener('click', ()=>{
        wishlist.push(p);
        updateFloatingCounts();
        renderSidebarItems('wishlist-items', wishlist);
      });
    });
  }

  function updateFloatingCounts(){
    document.getElementById('cart-count').textContent = cart.length;
    document.getElementById('wishlist-count').textContent = wishlist.length;
  }

  function renderSidebarItems(containerId, list){
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if(!list.length){
      container.innerHTML = '<p>No items yet.</p>';
      return;
    }
    list.forEach(item=>{
      const div = document.createElement('div');
      div.className = 'item';
      const imgSrc = item.image && item.image.trim() ? item.image : 'images/placeholder.png';
      div.innerHTML = `
        <img src="${imgSrc}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          <p class="price">${item.price ? toNGN(item.price) : ''}</p>
        </div>
      `;
      container.appendChild(div);
    });
  }

  // Floating button open sidebar
  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelector('.cart-btn').addEventListener('click', ()=>{
      document.getElementById('cart-sidebar').classList.add('active');
    });
    document.querySelector('.wishlist-btn').addEventListener('click', ()=>{
      document.getElementById('wishlist-sidebar').classList.add('active');
    });

    // Close buttons
    document.querySelectorAll('.close-btn').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const target = e.target.getAttribute('data-target');
        document.getElementById(target).classList.remove('active');
      });
    });
  });

  // Fetch products
  fetch('products.json', { cache: 'no-store' })
    .then(r => r.json())
    .then(data => {
      const products = Array.isArray(data) ? data : (data.products || []);
      render(products);
    })
    .catch(err => {
      console.error('Error loading products.json:', err);
      document.getElementById('product-list').innerHTML = '<p>Failed to load products.</p>';
    });

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();
})();
