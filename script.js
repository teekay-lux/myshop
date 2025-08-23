// Frontend logic: load products.json and render cards
(function(){
  const toNGN = n => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);

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
    <button class="btn primary">Add to Cart</button>
    <button class="btn secondary">Wishlist</button>
  </div>
`;
      container.appendChild(card);
    });
  }

  fetch('products.json', { cache: 'no-store' })
    .then(r => r.json())
    .then(data => {
      // Support two shapes:
      // 1) { "products": [ ... ] }  (from CMS)
      // 2) [ ... ]                  (simple array)
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
