<template>
  <div class="ctn">
    <div 
      v-for="(place, index) in pickupPlaces" 
      :key="index" 
      class="pickUp" 
      :class="[
        { pickUpSelected: selectedPlace === index },
        pickupPlaces.length === 1 ? 'singlePickUp' : ''
      ]"
      @click="changePickup(index)"
    >
      <div class="group">
        <div class="circle" :class="{ circleFilled: selectedPlace === index }"></div>
        <div class="info">
          <p class="placeName">
            {{ place.name.toUpperCase() }} 
            <span v-if="place.distance !== null">({{ place.distance.toFixed(1) }} km)</span>
          </p>
          <p class="address">{{ place.address }}</p>
          <a 
            class="mapLink" 
            :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.lat + ', ' + place.lon)}`" 
            target="_blank"
            @click.stop
          >
            Voir sur la carte
          </a>
          <p class="subtext">Prête habituellement en moins de 24 heures</p>
        </div>
      </div>
      <div class="right">
        <p class="free">SANS FRAIS</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const pickupPlaces = ref([
  { name: "Boutique dabadakondji", lat: 6.17370, lon: 1.27972, distance: null, address: "Rue dabadakondji, Lomé" }
]);

const selectedPlace = ref(null);
const emit = defineEmits(["pickupPlaceChanged"]);

function changePickup(index) {
  selectedPlace.value = index;
  emit("pickupPlaceChanged", pickupPlaces.value[index]);
}

// --- Haversine
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => reject("Geolocation refused")
      );
    } else {
      reject("Geolocation not supported");
    }
  });
}

async function getLocationFromIP() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return { lat: data.latitude, lon: data.longitude };
  } catch {
    return null;
  }
}

onMounted(async () => {
  let userLocation = null;

  try {
    userLocation = await getUserLocation();
  } catch {
    userLocation = await getLocationFromIP();
  }

  if (userLocation) {
    // Calculer les distances
    pickupPlaces.value = pickupPlaces.value.map(place => ({
      ...place,
      distance: haversine(userLocation.lat, userLocation.lon, place.lat, place.lon)
    }));

    // Trier par distance croissante
    pickupPlaces.value.sort((a, b) => a.distance - b.distance);

    // Sélectionner le lieu le plus proche
    changePickup(0);
  } else {
    changePickup(0);
  }
});
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.ctn {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.pickUp {
  display: flex;
  padding: 14px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border: 1px solid #ddd;
  transition: border-color 0.3s ease;
  font-size: 0.85em;
}
.pickUp:first-child {
  border-radius: 6px 6px 0 0;
  border-bottom: none;
}
.pickUp:last-child {
  border-radius: 0 0 6px 6px;
  border-top: none;
}
.singlePickUp {
  border-radius: 6px !important;
}
.group {
  display: flex;
  align-items: flex-start;
}
.circle {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border: 1px solid #333;
  background-color: transparent;
  border-radius: 50%;
  transition: border-width 0.2s ease, border-color 0.2s ease;
}
.pickUpSelected {
  border: 1px solid #333 !important;
}
.circleFilled {
  border: 6px solid #333;
}
.info {
  display: flex;
  flex-direction: column;
  transform: translateY(-3px);
}
.placeName {
  font-weight: 500;
}
.address {
  font-size: 0.75em;
  color: #444;
  margin-top: 2px;
}
.mapLink {
  font-size: 0.72em;
  color: #0070c0;
  margin-top: 2px;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;
  width: fit-content;
}
.mapLink:hover {
  text-decoration: underline;
  color: #004080;
}
.subtext {
  font-size: 0.7em;
  color: #666;
  margin-top: 2px;
}
.right {
  text-align: right;
}
.free {
  font-weight: bold;
  font-size: 0.85em;
}
</style>
