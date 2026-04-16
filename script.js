// SUPABASE SETUP
const SUPABASE_URL = 'https://qwbvldxgknpibpankovf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3YnZsZHhna25waWJwYW5rb3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MTQxMzUsImV4cCI6MjA5MTQ5MDEzNX0.ht1U5nO9dIVOWGjOzAS8N1XXOuGGIZg0D1vplmICMtA';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// WRAPPER for entire website 
 // document= html, adventlistener ="listen for this event", domcontent = html loaded, ready
document.addEventListener('DOMContentLoaded', () => {

// STATE
 // array of listing objects from supabase
  let listings = [];
 //which cat is selected
  let activeFilter = 'all';
 //array of map pins
  let markers = [];
 //leaflet map object
  let map;

// ELEMENTS
  const listingsPanel = document.getElementById('listings-panel');
  const detailBody = document.getElementById('detail-body');

  init();

// INIT
  async function init() {
  setupLanding();  
  initMap();
  setupEvents();
  await loadListings();
  renderAll();
}

// landing page
  function setupLanding() {
  const landing = document.getElementById('landing');
  const btn = document.getElementById('landing-btn');
  const input = document.getElementById('landing-email');

  // if they've already logged in before, skip the landing page
  const savedEmail = localStorage.getItem('swap_email');
if (savedEmail) {
  input.value = savedEmail;
}

  btn.addEventListener('click', () => {
    const email = input.value.trim();
    if (!email.endsWith('@newschool.edu')) {
      alert('Please use your @newschool.edu email to continue');
      return;
    }
    localStorage.setItem('swap_email', email);
    landing.classList.add('hidden');
  });
}

  // LEAFLET MAP 
  function initMap() {
    map = L.map('map').setView([40.7200, -73.9600], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
  }

// fetches supabase listings; 
  async function loadListings() {
    const { data, error } = await db
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    // exchange and availability are stored as comma-separated strings
    // so we split them back into arrays for the JS to use
    listings = data.map(l => ({
      ...l,
      exchange:     l.exchange     ? l.exchange.split(',')     : [],
      availability: l.availability ? l.availability.split(',') : [],
    }));
  }

// EVENTS
 // finds post a listing button, listens for click
 // when clicked, calls openPanel with post overlay
  function setupEvents() {
   document.getElementById('open-post-btn').addEventListener('click', () => {
  const saved = localStorage.getItem('swap_email');
  if (saved) document.getElementById('f-email').value = saved;
  openPanel('post-overlay');
});

// finds ALL elements with class close-btn
// btn.dataset.close reads data-close; knows which panel to close
    document.querySelectorAll('.close-btn').forEach(btn => {
      btn.addEventListener('click', () => closePanel(btn.dataset.close));
    });

    document.querySelectorAll('.overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closePanel(overlay.id);
      });
    });
 
// same pattern for filter btns. clicked, updates activeFilter, to whichever cat was clicked
// then rerenders everything si map and sidebar update
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.cat;
        renderAll();
      });
    });

    document.querySelector('.submit-btn')
      .addEventListener('click', submitListing);
  }

// FILTER
  // returns either all listings, or filtered subset
  function filteredListings() {
    return activeFilter === 'all'
      ? listings
      : listings.filter(l => l.cat === activeFilter);
  }

// RENDER
  function renderAll() {
    renderListings();
    renderMarkers();
  }

// 
  function renderListings() {
    const items = filteredListings();

    if (items.length === 0) {
      listingsPanel.innerHTML = '<p style="padding:1rem;color:#888">Nothing here yet.</p>';
      return;
    }

    //innerhtml= lets me set the HTML content of an element directly as a string
    //items.map= loops thru each listing and returns a string of html for each one

    listingsPanel.innerHTML = items.map(l => `
      <div class="listing-card" data-id="${l.id}">
        <strong>${l.item}</strong>
        <span style="font-size:0.75rem;float:right">
          ${l.type === 'have' ? 'offering' : 'wanted'}
        </span><br>
        <small>${l.hood} · ${l.cat}</small>
      </div>
    `).join('');

    document.querySelectorAll('.listing-card').forEach(card => {
      card.addEventListener('click', () => openDetail(card.dataset.id));
    });
  }

  // for each listing, creates a custom map pin
  function renderMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    const catColors = {
      "paint & color":       '#e74c3c',
      "textiles":      '#a34fc4ff',
      "paper & print":       '#14763dff',
      "tools & equipment":       '#1f6eb3ff',
      "electronics": '#c96f00ff',
      "other":       '#7f8c8d',
    };

    filteredListings().forEach(l => {
      const color = catColors[l.cat] || '#333';

      const icon = L.divIcon({
  className: '',
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 41" width="24" height="41">
    <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 29 12 29S24 19.2 24 12C24 5.4 18.6 0 12 0z" fill="${color}" stroke="white" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="4" fill="white" opacity="0.7"/>
  </svg>`,
  iconSize: [24, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

      const marker = L.marker([l.lat, l.lng], { icon }).addTo(map);
      marker.bindPopup(`<strong>${l.item}</strong><br>${l.hood}`);
      marker.on('click', () => openDetail(l.id));
      markers.push(marker);
    });
  }

//neighbourhood coordinates
  const HOOD_COORDS = {
    "Harlem":           [40.8115101408276,  -73.94533031951728],
    "East Harlem":      [40.79575476519956, -73.93944883380209],
    "Hell's Kitchen":   [40.763333431733464,-73.99069676743295],
    "Midtown":          [40.7554377198725,  -73.98439195343282],
    "Kips Bay":         [40.74265948462897, -73.97946545400457],
    "East Village":     [40.7265,           -73.9815],
    "West Village":     [40.73519593000064, -74.00293523928745],
    "Lower East Side":  [40.7150,           -73.9843],
    "SoHo":             [40.7233,           -74.0030],
    "Chinatown":        [40.71604675443742, -73.99713605521839],
    "Greenpoint":       [40.730031913998474,-73.95141953631435],
    "Williamsburg":     [40.70805755157338, -73.95696289675521],
    "Bed-Stuy":         [40.686942536753676,-73.9406073934154],
    "Crown Heights":    [40.66943468224459, -73.94250264382899],
    "Downtown Brooklyn":[40.69613386536019, -73.9842586347903],
    "Park Slope":       [40.67143667325164, -73.9772655780283],
    "Ridgewood":        [40.704292565923666,-73.90239095757352],
    "Bushwick":         [40.696310264968375,-73.91812798682241],
    "Long Island City": [40.744342070130315,-73.94991733313512],
    "Astoria":          [40.76479685517888, -73.923091264675],
    "Forest Hills":     [40.71839688926383, -73.84667226702216],
    "Jackson Heights":  [40.7553055479685,  -73.88232270010732],
    "Jersey City":      [40.71944472974092, -74.04722177392145],
    "Other":            [40.72,             -73.96]
  };


// SUBMIT
//chain of array methods
//starts with array of checkbox ids, filter keeps only ones that are checked.
//?. is optional chaining= "if this element exists, check checked"
//join= turns array into string like borrow, donate
  async function submitListing() {
    const email = document.getElementById('f-email').value.trim();
    const item  = document.getElementById('f-item').value.trim();
    const hood  = document.getElementById('f-hood').value;
    const cat   = document.getElementById('f-cat').value;
    const type  = document.querySelector('input[name="listing-type"]:checked').value;

    if (!email.endsWith('@newschool.edu')) { alert('Use your New School email'); return; }
    if (!item || !hood) { alert('Please fill in all fields'); return; }

    // collect checked checkboxes and join into comma-separated strings for storage
   const exchangeIds     = ['ex-exchange', 'ex-borrow', 'ex-donate', 'ex-paywish'];
const availabilityIds = ['av-pickup', 'av-meet', 'av-school', 'av-text'];

    const exchange     = exchangeIds
      .filter(id => document.getElementById(id)?.checked)
      .map(id => document.getElementById(id).value)
      .join(',');

    const availability = availabilityIds
      .filter(id => document.getElementById(id)?.checked)
      .map(id => document.getElementById(id).value)
      .join(',');

    const condition = document.querySelector('input[name="condition"]:checked')?.value || null;
    const desc      = document.getElementById('f-desc')?.value.trim() || '';
    const coords    = HOOD_COORDS[hood] || [40.72, -73.96];

    const newListing = {
      email, item, hood, cat, type, condition, exchange, availability, desc,
      lat: coords[0] + (Math.random() - 0.5) * 0.01,
      lng: coords[1] + (Math.random() - 0.5) * 0.01,
    };

    //sends new listing to supabase. insert adds new row
    const { error } = await db.from('listings').insert(newListing);

    if (error) {
      console.error('Error saving listing:', error);
      alert('Something went wrong, check the console');
      return;
    }

    //reload from supabase so everyone sees the new listing
    await loadListings();
    renderAll();
    closePanel('post-overlay');
    alert('Listing posted!');
  }

  // DETAIL 
  // find searches thru listings array and returns the first item where condition is true
  function openDetail(id) {
    const l = listings.find(x => x.id == id);
    if (!l) return;

    detailBody.innerHTML = `
      <h3>${l.item}</h3>
      <p><strong>Type:</strong> ${l.type === 'have' ? 'Offering' : 'Wanted'}</p>
      <p><strong>Category:</strong> ${l.cat}</p>
      <p><strong>Neighborhood:</strong> ${l.hood}</p>
      ${l.condition ? `<p><strong>Condition:</strong> ${l.condition}</p>` : ''}
      ${l.exchange?.length ? `<p><strong>Exchange:</strong> ${l.exchange.join(', ')}</p>` : ''}
      ${l.availability?.length ? `<p><strong>Availability:</strong> ${l.availability.join(', ')}</p>` : ''}
      ${l.desc ? `<p style="margin-top:0.75rem">${l.desc}</p>` : ''}
      <button id="contact-btn" style="margin-top:1rem">Contact</button>
    `;

    document.getElementById('contact-btn').addEventListener('click', () => {
      alert(`Contact: ${l.email}`);
    });

    openPanel('detail-overlay');
    map.flyTo([l.lat, l.lng], 15);
  }

//PANELS
//classList= list of all CSS classes on an element
//.add open adds open class, which css uses to switch from
//display none to display flex
//remove open takes it away and panel disappears.
//the whole show/hide system is just adding and removing one css class
  function openPanel(id)  { document.getElementById(id).classList.add('open'); }
  function closePanel(id) { document.getElementById(id).classList.remove('open'); }

});

async function deleteListing(id) {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete failed:', error);
  } else {
    console.log('Deleted!');
    renderMarkers();
  }
}
