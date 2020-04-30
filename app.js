"use strict";

const API_KEY = "Jkqte7XrY6k62bc1LVvI1uiWqVAkwElXEOxut98t";
const searchURL = "https://developer.nps.gov/api/v1/parks";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}
//Empty the results list if there was anything there
function displayResults(responseJson) {
  console.log(responseJson);
  $("#results-list").empty();
  //Iterate through each item in the array
  let html = "";
  for (let i = 0; i < responseJson.data.length; i++) {
    const park = responseJson.data[i];
    const parkDescription = park.description;
    const parkName = park.name;
    const url = park.url;
    const parkAddress = park.directionsInfo;

    html += `
      <li><h3>${parkName}</h3>
      <p>Description: ${parkDescription}</p>
      <p>URL : <a href="${url}">${url}</a></p>
      <p>Address: ${parkAddress}</p>
      </li>`;
  }
  //Display the results section that was previously hidden
  $("#results-list").html(html);
  $("#results").removeClass("hidden");
}

function getParkResults(query, maxResults = 10) {
  maxResults -= 1;

  //Passed in parameters to query string
  const params = {
    api_key: API_KEY,
    limit: maxResults,
    stateCode: query,
  };

  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchFormSubmit() {
  $(".main-form").submit(function (event) {
    event.preventDefault();
    const state = $(this).find("#state").val();
    const maxResults = $(this).find("#max").val();
    getParkResults(state, maxResults);
  });
}

$(watchFormSubmit);
