const geographyNode = document.getElementById('geography')
const statesNode = document.getElementById('states')
const zipcodeInfoNode = document.getElementById('zipcode-info')
let selectedState = null
let currentZipcodeInfo = null
let loading = false

const fetchZipcodeInfo = async (zipcode) => {
  return fetch(`http://api.zippopotam.us/us/${zipcode}`)
}

const updateZipcodeInfo = () => {
  const place = currentZipcodeInfo.places[0]
  zipcodeInfoNode.innerHTML = `
    <ul>
      <li><h1>${place['place name']}</h1></li>
      <li><h3>${place.state} (${place['state abbreviation']}), ${currentZipcodeInfo.country}</h3></li>
      <li>${place.latitude}, ${place.longitude}</li>
    </ul>
  `
}

const selectState = (stateAbbv) => {
  if (selectedState) {
    const currentState = statesNode.querySelector(`.state[data-active]`)
    currentState.removeAttribute('data-active');
  }
  selectedState = stateAbbv
  statesNode.querySelector(`.state[data-svg='${selectedState}']`).setAttribute('data-active', true)
  updateZipcodeInfo()
}

// Capture zip code and fetch info from API
const form = document.getElementById('form')
form.onsubmit = async (event) => {
  event.preventDefault()
  const zipcode = event.target.querySelector('input[name=zipcode]').value

  if (loading || !zipcode.length) {
    return
  }
  document.getElementById('submit-btn').setAttribute('disabled', 'disabled');
  document.getElementById('zipcode').setAttribute('disabled', 'disabled');
  loading = true

  const result = await fetchZipcodeInfo(zipcode)
  const json = await result.json()
  loading = false
  
  document.getElementById('submit-btn').removeAttribute('disabled')
  document.getElementById('zipcode').removeAttribute('disabled')

  if (json.places) {
    currentZipcodeInfo = json
    selectState(currentZipcodeInfo.places[0]['state abbreviation'])
  } else {
    alert('Invalid zipcode')
  }
}

// Fill out the States SVGs
Object.keys(SVGS).forEach((svgKey) => {
  const stateNode = document.createElement('div')
  if(svgKey == "USA") {
    stateNode.className = 'country'
    geographyNode.appendChild(stateNode)
  } else {
    stateNode.className = 'state'
    statesNode.appendChild(stateNode)
  }

  stateNode.setAttribute('data-svg', svgKey)
  stateNode.innerHTML = SVGS[svgKey]
})