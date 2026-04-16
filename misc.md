






Redaction 35 Regular
font-family: "redaction-35", sans-serif;
font-weight: 400;
font-style: normal;

Redaction 35 Italic
font-style: italic;

Redaction 35 Bold
font-family: "redaction-35", sans-serif;
font-weight: 700;
font-style: normal;

Redaction 50 Regular - more separated
font-family: "redaction-50", sans-serif;
font-weight: 400;
font-style: normal;











  //detail
  // function openDetail(id) {
  //   const l = listings.find(x => x.id === id);
  //   if (!l) return;

  //   detailBody.innerHTML = `
  //     <h3>${l.item}</h3>
  //     <p><strong>Type:</strong> ${l.type}</p>
  //     <p><strong>Category:</strong> ${l.cat}</p>
  //     <p><strong>Neighborhood:</strong> ${l.hood}</p>
  //     <button id="contact-btn">Contact</button>
  //   `;

  //   document.getElementById('contact-btn').addEventListener('click', () => {
  //     alert(`Contact: ${l.email}`);
  //   });

  //   openPanel('detail-overlay');
  //   map.flyTo([l.lat, l.lng], 15);
  // }



 // // ─── SUPABASE SETUP ───────────────────────────────────────────────────────────
// const SUPABASE_URL = 'https://qwbvldxgknpibpankovf.supabase.co';
// const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3YnZsZHhna25waWJwYW5rb3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MTQxMzUsImV4cCI6MjA5MTQ5MDEzNX0.ht1U5nO9dIVOWGjOzAS8N1XXOuGGIZg0D1vplmICMtA';
// const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// document.addEventListener('DOMContentLoaded', () => {

//   //state
//   let listings = [];
//   let activeFilter = 'all';
//   let markers = [];
//   let map;

//   //elements
//   const listingsPanel = document.getElementById('listings-panel');
//   const postOverlay = document.getElementById('post-overlay');
//   const detailOverlay = document.getElementById('detail-overlay');
//   const detailBody = document.getElementById('detail-body');


//   init();

//   function init() {
//     loadListings();
//     initMap();
//     setupEvents();
//     renderAll();
//   }

//   //map - plain boring white
//   // function initMap() {
//   //   map = L.map('map').setView([40.7200, -73.9600], 12);

//   //   L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
//   //     attribution: '© OpenStreetMap © CARTO',
//   //     subdomains: 'abcd',
//   //     maxZoom: 19
//   //   }).addTo(map);
//   // }

//   //map - colorful
// function initMap() {
//     map = L.map('map').setView([40.7200, -73.9600], 12);

//   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);
// }

//   //local storage
//   function loadListings() {
//     try {
//       const stored = localStorage.getItem('swap_listings');
//       if (stored) listings = JSON.parse(stored);
//     } catch (err) {
//       console.error('Load error:', err);
//     }
//   }

//   function saveListings() {
//     try {
//       localStorage.setItem('swap_listings', JSON.stringify(listings));
//     } catch (err) {
//       console.error('Save error:', err);
//     }
//   }

//   //events
//   function setupEvents() {

//     //open post panel
//     document.getElementById('open-post-btn')
//       .addEventListener('click', () => openPanel('post-overlay'));

//     //close buttons
//     document.querySelectorAll('.close-btn').forEach(btn => {
//       btn.addEventListener('click', () => {
//         closePanel(btn.dataset.close);
//       });
//     });

//     //background
//     document.querySelectorAll('.overlay').forEach(overlay => {
//       overlay.addEventListener('click', (e) => {
//         if (e.target === overlay) closePanel(overlay.id);
//       });
//     });

//     //filters
//     document.querySelectorAll('.filter-btn').forEach(btn => {
//       btn.addEventListener('click', () => {
//         activeFilter = btn.dataset.cat;
//         renderAll();
//       });
//     });

//     //submit
//     document.querySelector('.submit-btn')
//       .addEventListener('click', submitListing);
//   }

//   //filtering
//   function filteredListings() {
//     return activeFilter === 'all'
//       ? listings
//       : listings.filter(l => l.cat === activeFilter);
//   }

//   function renderAll() {
//     renderListings();
//     renderMarkers();
//   }

//   function renderListings() {
//     const items = filteredListings();

//     if (items.length === 0) {
//       listingsPanel.innerHTML = '<p style="padding:1rem;color:#888">Nothing here yet.</p>';
//       return;
//     }

//     listingsPanel.innerHTML = items.map(l => `
//       <div class="listing-card" data-id="${l.id}">
//         <strong>${l.item}</strong>
//         <span style="font-size:0.75rem;float:right">
//           ${l.type === 'have' ? 'offering' : 'wanted'}
//         </span><br>
//         <small>${l.hood} · ${l.cat}</small>
//       </div>
//     `).join('');

//     document.querySelectorAll('.listing-card').forEach(card => {
//       card.addEventListener('click', () => openDetail(card.dataset.id));
//     });
//   }

//   function renderMarkers() {
//     markers.forEach(m => map.removeLayer(m));
//     markers = [];

//     filteredListings().forEach(l => {
//       const marker = L.marker([l.lat, l.lng]).addTo(map);

//       marker.bindPopup(`<strong>${l.item}</strong><br>${l.hood}`);

//       marker.on('click', () => openDetail(l.id));

//       markers.push(marker);
//     });
//   }

//   const HOOD_COORDS = {
//   "Harlem": [40.8115101408276, -73.94533031951728],
//   "East Harlem": [40.79575476519956, -73.93944883380209],
//   "Hell's Kitchen": [40.763333431733464, -73.99069676743295],
//   "Midtown": [40.7554377198725, -73.98439195343282],
//   "Kips Bay": [40.74265948462897, -73.97946545400457],
//   "East Village": [40.7265, -73.9815],
//   "West Village": [40.73519593000064, -74.00293523928745],
//   "Lower East Side": [40.7150, -73.9843],
//   "SoHo": [40.7233, -74.0030],
//   "Chinatown": [40.71604675443742, -73.99713605521839],
//   "Greenpoint": [40.730031913998474, -73.95141953631435],
//   "Williamsburg": [40.70805755157338, -73.95696289675521],
//   "Bed-Stuy": [40.686942536753676, -73.9406073934154],
//   "Crown Heights": [40.66943468224459, -73.94250264382899],
//   "Downtown Brooklyn": [40.69613386536019, -73.9842586347903],
//   "Park Slope": [40.67143667325164, -73.9772655780283],
//   "Ridgewood": [40.704292565923666, -73.90239095757352],
//   "Bushwick": [40.696310264968375, -73.91812798682241],
//   "Long Island City": [40.744342070130315, -73.94991733313512],
//   "Astoria": [40.76479685517888, -73.923091264675],
//   "Forest Hills": [40.71839688926383, -73.84667226702216],
//   "Jackson Heights": [40.7553055479685, -73.88232270010732],
//   "Jersey City": [40.71944472974092, -74.04722177392145],
//   "Other": [40.72, -73.96]
// };

//   //submit
//   function submitListing() {
//     const email = document.getElementById('f-email').value.trim();
//     const item  = document.getElementById('f-item').value.trim();
//     const hood  = document.getElementById('f-hood').value;
//     const cat   = document.getElementById('f-cat').value;
//     const type  = document.querySelector('input[name="listing-type"]:checked').value;

//     if (!email.endsWith('@newschool.edu')) {
//       alert('Use your New School email');
//       return;
//     }

//     if (!item || !hood) {
//       alert('missing fields');
//       return;
//     }

//     const coords = HOOD_COORDS[hood] || [40.72, -73.96];

//     const newListing = {
//       id: 'u' + Date.now(),
//       email,
//       item,
//       hood,
//       cat,
//       type,
//       lat: coords[0] + (Math.random() - 0.5) * 0.01,
//       lng: coords[1] + (Math.random() - 0.5) * 0.01
//     };

//     listings.unshift(newListing);

//     saveListings();
//     renderAll();
//     closePanel('post-overlay');

//     alert('Listing posted!');
//   }

//   //listing
//   function openDetail(id) {
//     const l = listings.find(x => x.id === id);
//     if (!l) return;

//     detailBody.innerHTML = `
//       <h3>${l.item}</h3>
//       <p><strong>Type:</strong> ${l.type}</p>
//       <p><strong>Category:</strong> ${l.cat}</p>
//       <p><strong>Neighborhood:</strong> ${l.hood}</p>
//       <button id="contact-btn">Contact</button>
//     `;

//     document.getElementById('contact-btn').addEventListener('click', () => {
//       alert(`Contact: ${l.email}`);
//     });

//     openPanel('detail-overlay');
//     map.flyTo([l.lat, l.lng], 15);
//   }

//   //panels
//   function openPanel(id) {
//     document.getElementById(id).classList.add('open');
//   }

//   function closePanel(id) {
//     document.getElementById(id).classList.remove('open');
//   }

// });