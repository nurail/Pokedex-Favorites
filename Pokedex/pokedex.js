window.onload = async () => {
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  //To check if access_token still exists, if not, log out the user
  const access_token = getCookie("access_token");
  if (!access_token) {
    window.location.assign("http://127.0.0.1:5500/views/main.html");
    alert("Your login session time has run out");
  }

  function eraseCookie(name) {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }

  const myHeaders = new Headers({
    Authorization: `Bearer ${getCookie("access_token")}`,
  });

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  //fetch the cookie for authorization
  let response = await fetch(
    "http://localhost:3000/users/favPokemonArray",
    requestOptions
  )
    .then((res) => {
      return res.json();
    })
    .then(async (result) => {
      let myJson = (async function main() {
        await fetch(
          "https://cors-anywhere-server.fly.dev/https://www.pokemon.com/us/api/pokedex/kalos"
        )
          .then((res) => {
            return res.json();
          })
          .then((myJson) => {
            console.log(myJson);

            //----------VARIABLE DECLARATIONS----------//

            let container = document.getElementById("container"); //overall container
            let pokemonSearch = document.getElementById("searchBox"); //search box
            let randomPokemon = document.getElementById("randomPokemon"); //surprise me button
            const dropdown = document.getElementById("dropbtnFilter"); //dropdown menu
            const lowestToHighest = document.getElementById("lowestToHighest"); //lowest to highest sort button
            const highestToLowest = document.getElementById("highestToLowest"); // Highest to Lowest sort button
            const a_to_z = document.getElementById("a-to-z"); // A to Z sort button
            const z_to_a = document.getElementById("z-to-a"); // Z to A sort button
            const search = document.getElementById("search");
            const reset = document.getElementById("reset");
            const abilitiesList = document.getElementById("abilities");
            const advancedSearchBtn = document.getElementById("searchAdvanced");
            const advancedSearchBlock = document.querySelector(
              "#advancedSearchNavigationBar"
            );
            const advancedSearchToggle = document.querySelector(
              ".advancedSearchToggle"
            );
            const resetFilters = document.getElementById("resetFilters");
            const loadMorePokemon = document.getElementById("loadMorePokemon");
            const loadMorePokemonContainer = document.getElementById(
              "loadMorePokemonContainer"
            );
            let favPokemonBtn = document.querySelectorAll(".fav-pokemon-btn");
            let filterSmall = document.querySelector(
              ".pokedex-filter-height-small"
            );
            let filterMediumHeight = document.querySelector(
              ".pokedex-filter-height-medium"
            );
            let filterTall = document.querySelector(
              ".pokedex-filter-height-tall"
            );
            let filterLight = document.querySelector(
              ".pokedex-filter-weight-light"
            );
            let filterMediumWeight = document.querySelector(
              ".pokedex-filter-weight-medium"
            );
            let filterHeavy = document.querySelector(
              ".pokedex-filter-weight-heavy"
            );

            let pokemonDatabaseLength = myJson.length;
            let sortedArray = [];
            let index = 0;
            let globalCounter = 0,
              aToZSearchCounter = 0;
            let displayCounter = 16;
            let favoritePokemonArray = [];

            //----------Making the container grid----------//
            function makeGrid(displayCounterArg) {
              if (lowestToHighest.getAttribute("selected") == "selected") {
                for (
                  let c = 0, cNext = c + 1, count = 0;
                  c < pokemonDatabaseLength && count < displayCounterArg;
                  c++, cNext++
                ) {
                  count = displayIfSearchExists(c, cNext, count, false); //function call to return count whenever a pokemon is displayed
                }
                loadMorePokemonContainer.append(loadMorePokemon);
              } else if (
                highestToLowest.getAttribute("selected") == "selected"
              ) {
                for (
                  let c = myJson.length - 1, cNext = c - 1, count = 0;
                  c > 0 && count < displayCounterArg;
                  c--, cNext--
                ) {
                  count = displayIfSearchExists(c, cNext, count, false); //function call to return count whenever a pokemon is displayed
                }
                loadMorePokemonContainer.append(loadMorePokemon);
              } else if (a_to_z.getAttribute("selected") == "selected") {
                aToZSearchCounter = 0;
                for (
                  let c = 0, cNext = c + 1, count = 0;
                  c < pokemonDatabaseLength &&
                  aToZSearchCounter < displayCounterArg;
                  c++, cNext++
                ) {
                  count = displayIfSearchExists(c, cNext, count, false); //function call to return count whenever a pokemon is displayed
                }
                loadMorePokemonContainer.appendChild(loadMorePokemon);
              } else if (z_to_a.getAttribute("selected") == "selected") {
                aToZSearchCounter = 0;
                for (
                  let c = 0, cNext = c + 1, count = 0;
                  c < pokemonDatabaseLength &&
                  aToZSearchCounter < displayCounterArg;
                  c++, cNext++
                ) {
                  count = displayIfSearchExists(c, cNext, count, false); //function call to return count whenever a pokemon is displayed
                }
                loadMorePokemonContainer.appendChild(loadMorePokemon);
              } else if (
                advancedSearchBlock.getAttribute("filter") == "active"
              ) {
                let count = 0;
                advancedSearchBtnFunction(count, displayCounter);
                loadMorePokemonContainer.append(loadMorePokemon);
              }
            }

            //Finding range of heights
            let small = 50,
              large = 100;

            let smallPokemon = [],
              mediumHeightPokemon = [],
              tallPokemon = [];

            for (const element of Object.values(myJson)) {
              if (element.height < small) {
                smallPokemon.push(element);
              } else if (element.height <= large && element.height > small) {
                mediumHeightPokemon.push(element);
              } else {
                tallPokemon.push(element);
              }
            }

            //Finding range of weights
            let lightPokemon = [],
              mediumWeightPokemon = [],
              heavyPokemon = [];

            for (const element of Object.values(myJson)) {
              if (element.weight < small) {
                lightPokemon.push(element);
              } else if (element.weight <= large && element.weight > small) {
                mediumWeightPokemon.push(element);
              } else {
                heavyPokemon.push(element);
              }
            }

            //----------FUNCTIONS----------//

            function init() {
              container.innerHTML = "";
              searchPokemonValue();
            }

            function searchPokemonValue() {
              pokemonSearch = document.getElementById("searchBox").value;
            }
            //Making the initial first 16 pokemon display
            makeGrid(displayCounter);

            //Displays content if search box is empty or filled
            function displayIfSearchExists(c, cNext, count, display) {
              //checking for repeats due to different characteristics
              if (
                myJson &&
                myJson[c] &&
                myJson[cNext] &&
                myJson[c].id !== myJson[cNext].id &&
                (pokemonSearch.textContent === "" || pokemonSearch === "")
              ) {
                if (
                  a_to_z.getAttribute("selected") === "selected" ||
                  z_to_a.getAttribute("selected") === "selected"
                ) {
                  let index = getIndexOF(count);
                  if (!display) {
                    if (index >= 0) {
                      pokemonDisplay(index);
                      count++;
                      aToZSearchCounter++;
                    }
                  }
                } else {
                  if (!display) {
                    pokemonDisplay(c); //displaying the initial pokemon
                    count++;
                  }
                }
              } else if (
                myJson &&
                myJson[c] &&
                myJson[cNext] &&
                myJson[c].id !== myJson[cNext].id &&
                pokemonSearch.textContent !== ""
              ) {
                if (
                  highestToLowest.getAttribute("selected") === "selected" ||
                  lowestToHighest.getAttribute("selected") === "selected"
                ) {
                  if (
                    myJson[c].name
                      .toLowerCase()
                      .includes(pokemonSearch.toLowerCase()) ||
                    myJson[c].number.includes(pokemonSearch) //if search pokemon contains input being searched
                  ) {
                    if (!display) {
                      pokemonDisplay(c); //displaying a searched pokemon
                      count++;
                      aToZSearchCounter++;
                    }
                  }
                } else if (
                  a_to_z.getAttribute("selected") === "selected" ||
                  z_to_a.getAttribute("selected") === "selected"
                ) {
                  index = getIndexOF(count);
                  if (
                    index >= 0 &&
                    (myJson[index].name
                      .toLowerCase()
                      .includes(pokemonSearch.toLowerCase()) ||
                      myJson[index].number.includes(pokemonSearch))
                  ) {
                    if (!display) {
                      pokemonDisplay(index);
                      aToZSearchCounter++; //counter for forming the grid for A_TO_Z & Z_TO_A Sorts with a search field
                    }
                  }
                  count++;
                } else {
                  if (!display) {
                    pokemonDisplay(c); //displaying a searched pokemon
                    count++;
                  }
                }
              }
              return count;
            }

            //Displaying the grid for different cases
            function pokemonDisplay(c) {
              let ul = document.createElement("ul");
              ul.setAttribute("style", "list-style-type: none");
              let li = document.createElement("li");
              li.style.opacity = 1;
              li.style.top = "0px";
              li.style.left = "0px";
              li.style.listStyleType = "none";

              //Image Display
              let figure = document.createElement("figure");
              figure.setAttribute("style", "background-color: white");
              let image_anchor = document.createElement("a");
              let image = document.createElement("img");
              var aTag = document.createElement("a");
              aTag.setAttribute("href", "");
              figure.appendChild(aTag);
              let pokemonImg = document.createElement("img");
              pokemonImg.src = myJson[c].ThumbnailImage;

              pokemonImg.setAttribute("class", "pokemonImage");
              figure.appendChild(pokemonImg);
              li.appendChild(pokemonImg);

              //Pokemon Info - ID and Name
              let pokemon_info_div = document.createElement("div");
              pokemon_info_div.setAttribute("class", "pokemonInfo");
              let pokemon_id = document.createElement("p");
              pokemon_id.innerHTML = "#" + myJson[c].number;
              const pokemon_name = document.createElement("h5");
              const textNode = document.createTextNode(myJson[c].name);
              pokemon_name.appendChild(textNode);
              pokemon_info_div.appendChild(pokemon_id);
              pokemon_info_div.appendChild(pokemon_name);
              li.appendChild(pokemon_info_div);

              //Pokemon Types
              let pokemon_types_div = document.createElement("div");
              pokemon_types_div.setAttribute("class", "pokemonTypes");
              let pokemonType1 = document.createElement("span");
              pokemonType1.innerHTML = myJson[c].type[0];
              pokemonType1.setAttribute("class", `${pokemonType1.innerHTML}`);
              let pokemonType2 = document.createElement("span");
              pokemonType2.innerHTML = myJson[c].type[1];
              pokemonType2.setAttribute("class", `${pokemonType2.innerHTML}`);

              pokemonType2.innerHTML = myJson[c].type[1]
                ? myJson[c].type[1]
                : ""; //checking if there's a second type

              pokemon_types_div.appendChild(pokemonType1);
              pokemon_types_div.appendChild(pokemonType2);
              li.appendChild(pokemon_types_div);

              li.setAttribute("accesskey", c);

              ul.append(li);
              container.append(ul);
            }

            //Sorting a property of the array
            function sortingPokemonNames() {
              for (const values of Object.values(myJson)) {
                if (!sortedArray.includes(values.name)) {
                  sortedArray.push(values.name);
                }
              }
              return sortedArray.sort();
            }

            //Finding index of name function
            function getIndexOF(count) {
              for (var i = 0; i < myJson.length; i++) {
                if (myJson[i].name === sortedArray[count]) {
                  return i;
                }
              }
              return -1;
            }

            //Toggle display of sort filter
            function toggleDropDown() {
              document.getElementById("myDropDown").classList.toggle("show");
            }

            function filtersToggleFunctionality(e) {
              if (!e.target.matches("#dropbtnFilter")) {
                let dropdowns =
                  document.getElementsByClassName("dropdown-content");
                for (let i = 0; i < dropdowns.length; i++) {
                  let openDropdown = dropdowns[i];
                  if (openDropdown.classList.contains("show")) {
                    openDropdown.classList.remove("show");
                  }
                }
              }
            }

            //filtering abilities function
            function filterSearchAbilities(ability) {
              if (ability == abilitiesList.value) {
                return ability;
              }
            }

            //resetting the background-color of height/weight buttons
            function resetFilterHighlight() {
              filterLight.style.backgroundColor = "buttonface";
              filterMediumWeight.style.backgroundColor = "buttonface";
              filterHeavy.style.backgroundColor = "buttonface";
              filterSmall.style.backgroundColor = "buttonface";
              filterMediumHeight.style.backgroundColor = "buttonface";
              filterTall.style.backgroundColor = "buttonface";
            }

            function advancedSearchBtnFunction(count, displayCounter) {
              init();
              let globalCounter = 0;
              for (const value of advancedFilterSet) {
                for (let c = count; globalCounter < displayCounter; ) {
                  if (
                    myJson[c].name &&
                    !value.abilities &&
                    myJson[c].name !== value
                  ) {
                    c++;
                  } else if (
                    value.abilities &&
                    !(
                      myJson[c].abilities.includes(value.abilities[0]) ||
                      myJson[c].abilities.includes(value.abilities[1])
                    )
                  ) {
                    c++;
                  } else {
                    // console.log(c, cNext, count, globalCounter, displayCounter);
                    pokemonDisplay(c);
                    globalCounter++;
                    count = c + 1;
                    break;
                  }
                }
              }
            }

            function filteringHeightORWeight(categoryHW) {
              advancedFilterSet.clear();
              advancedSearchBlock.setAttribute("filter", "active");

              resetFilterHighlight();

              displayCounter = 16;
              globalCounter = 0;

              weaknessFilter.forEach((el) => (el.checked = false));
              typesFilter.forEach((el) => (el.checked = false));

              abilitiesList.removeAttribute("class");
              abilitiesList[0].setAttribute("class", "selected");
              abilitiesList.selectedIndex = 0;

              for (const value of categoryHW) {
                let counter = 0;
                for (
                  let c = counter, cNext = counter + 1, count = 0;
                  globalCounter < pokemonDatabaseLength;

                ) {
                  if (value.name !== myJson[c].name) {
                    c++;
                  } else {
                    count = displayIfSearchExists(c, cNext, count, true);
                    advancedFilterSet.add(myJson[c].name);
                    globalCounter++;
                    counter++;
                    break;
                  }
                }
              }
            }

            function resetData() {
              advancedFilterSet.clear();

              typesFilter.forEach((el) => {
                el.removeAttribute("filter");
                el.checked = false;
              });
              weaknessFilter.forEach((el) => {
                el.removeAttribute("filter");
                el.checked = false;
              });
              abilitiesList.removeAttribute("class");
              abilitiesList[0].setAttribute("class", "selected");
              abilitiesList.selectedIndex = 0;

              resetFilterHighlight();
              advancedSearchBlock.removeAttribute("filter");

              lowestToHighest.setAttribute("selected", "selected");
              highestToLowest.setAttribute("selected", "null");
              a_to_z.setAttribute("selected", "null");
              z_to_a.setAttribute("selected", "null");
              displayCounter = 16;
              init();
              makeGrid(displayCounter);
            }

            //----------DOM EVENTS----------//

            //SEARCHING FOR POKEMON EVENT
            pokemonSearch.addEventListener("keyup", function (e) {
              init();
              makeGrid(displayCounter);
            });

            //SURPRISE ME EVENT
            randomPokemon.addEventListener("click", function (e) {
              document.getElementById("searchBox").textContent = "";
              init();
              displayCounter = 16;

              const randomPokemonIDs = []; //storing IDs of random pokemon
              const randomPokemonIDsRepeats = []; //storing IDs to check for repeats
              for (let count = 0; count < displayCounter; ) {
                let randomID = Math.trunc(Math.random() * myJson.length); //getting random number from pokedex length
                let randomIDPokemon = myJson[randomID].id; //extracting ID of random pokemon
                if (
                  !randomPokemonIDs.includes(randomID) &&
                  !randomPokemonIDsRepeats.includes(randomIDPokemon)
                ) {
                  randomPokemonIDs[count] = randomID;
                  randomPokemonIDsRepeats[count] = randomIDPokemon;
                  pokemonDisplay(randomPokemonIDs[count]); //displaying a random pokemon
                  count++;
                }
              }
              loadMorePokemonContainer.removeChild(loadMorePokemon);
            });

            //Display sort filters
            dropdown.addEventListener("click", function (e) {
              toggleDropDown(e);
              filtersToggleFunctionality(e);
            });

            //Hide sort filters on clicking elsewhere
            window.addEventListener("click", function (e) {
              filtersToggleFunctionality(e);
            });

            let advancedFilterSet = new Set();

            let typesFilter = document.querySelectorAll(".filter.filter-type");
            let weaknessFilter = document.querySelectorAll(
              ".filter.filter-weakness"
            );
            let typesFilterArray = [],
              weaknessFilterArray = [];

            let typesFilterSet = new Set(),
              weaknessFilterSet = new Set();

            typesFilter.forEach((el) => {
              el.addEventListener("change", function () {
                advancedFilterSet.clear();
                typesFilterArray = [];

                typesFilter.forEach((otherEl) => (otherEl.checked = false));
                el.checked = true;

                weaknessFilter.forEach((el) => (el.checked = false));

                abilitiesList.removeAttribute("class");
                abilitiesList[0].setAttribute("class", "selected");
                abilitiesList.selectedIndex = 0;

                resetFilterHighlight();
                el.setAttribute("filter", "active");
                advancedSearchBlock.setAttribute("filter", "active");
                if (el.checked) {
                  for (const value of Object.values(myJson)) {
                    if (value.type.includes(el.value)) {
                      typesFilterArray.push(value.name);
                    }
                  }
                }
                typesFilterSet = [...new Set(typesFilterArray)];
                globalCounter = 0;
                displayCounter = 16;
                for (const value of Object.values(typesFilterSet)) {
                  let counter = 0;
                  for (
                    let c = counter, cNext = counter + 1, count = 0;
                    globalCounter < pokemonDatabaseLength;

                  ) {
                    if (myJson[c].name !== value) {
                      c++;
                    } else {
                      count = displayIfSearchExists(c, cNext, count, true);
                      advancedFilterSet.add(value);
                      globalCounter++;
                      counter++;
                      break;
                    }
                  }
                }
                loadMorePokemonContainer.appendChild(loadMorePokemon);
              });
            });

            weaknessFilter.forEach((el) => {
              el.addEventListener("change", function () {
                advancedFilterSet.clear();
                weaknessFilterArray = [];

                weaknessFilter.forEach((otherEl) => (otherEl.checked = false));
                el.checked = true;
                typesFilter.forEach((el) => (el.checked = false));

                resetFilterHighlight();

                abilitiesList.removeAttribute("class");
                abilitiesList[0].setAttribute("class", "selected");
                abilitiesList.selectedIndex = 0;
                el.setAttribute("filter", "active");
                advancedSearchBlock.setAttribute("filter", "active");
                if (el.checked) {
                  for (const value of Object.values(myJson)) {
                    value.weakness.forEach((element) => {
                      let weaknessLowerCase = element.toLowerCase(); //Making each weakness lowercase to check if weakness type exists
                      if (weaknessLowerCase.includes(el.value)) {
                        weaknessFilterArray.push(value.name);
                      }
                    });
                  }
                }
                weaknessFilterSet = [...new Set(weaknessFilterArray)];
                globalCounter = 0;
                displayCounter = 16;
                for (const value of Object.values(weaknessFilterSet)) {
                  let counter = 0;
                  for (
                    let c = counter, cNext = counter + 1, count = 0;
                    globalCounter < pokemonDatabaseLength;

                  ) {
                    if (value !== myJson[c].name) {
                      c++;
                    } else {
                      count = displayIfSearchExists(c, cNext, count, true);
                      advancedFilterSet.add(value);
                      globalCounter++;
                      counter++;
                      break;
                    }
                  }
                }
                loadMorePokemonContainer.appendChild(loadMorePokemon);
              });
            });

            abilitiesList.addEventListener("change", function () {
              abilitiesList.setAttribute("class", "selected");
              abilitiesList.setAttribute("filter", "active");
              advancedSearchBlock.setAttribute("filter", "active");
              let filteredAbilities = [];
              advancedFilterSet.clear();
              const abiltiesSearchedSet = new Set();

              resetFilterHighlight();

              weaknessFilter.forEach((el) => (el.checked = false));
              typesFilter.forEach((el) => (el.checked = false));

              if (abilitiesList.value !== "All") {
                for (const key of Object.keys(myJson)) {
                  filteredAbilities = myJson[key].abilities.filter(
                    filterSearchAbilities
                  );
                  if (filteredAbilities.includes(abilitiesList.value)) {
                    abiltiesSearchedSet.add(myJson[key].id);
                  }
                }
                displayCounter = 16;
                globalCounter = 0;
                let counter = 0;
                for (const value of abiltiesSearchedSet) {
                  for (
                    let c = counter, cNext = counter + 1, count = 0;
                    globalCounter < pokemonDatabaseLength;

                  ) {
                    if (value !== myJson[c].id) {
                      c++;
                      cNext++;
                    } else {
                      count = displayIfSearchExists(c, cNext, count, true);
                      advancedFilterSet.add(myJson[c]);
                      globalCounter++;
                      counter++;
                      break;
                    }
                  }
                }
                loadMorePokemonContainer.appendChild(loadMorePokemon);
              } else {
                init();
                makeGrid(displayCounter);
                loadMorePokemonContainer.appendChild(loadMorePokemon);
              }
            });

            //height events
            filterTall.addEventListener("click", function () {
              filteringHeightORWeight(tallPokemon);
              filterTall.setAttribute("filter", "active");
              filterTall.style.backgroundColor = "orange";
            });

            filterMediumHeight.addEventListener("click", function () {
              filteringHeightORWeight(mediumHeightPokemon);
              filterMediumHeight.setAttribute("filter", "active");
              filterMediumHeight.style.backgroundColor = "orange";
            });

            filterSmall.addEventListener("click", function () {
              filteringHeightORWeight(smallPokemon);
              filterSmall.setAttribute("filter", "active");
              filterSmall.style.backgroundColor = "orange";
            });

            //weight events
            filterHeavy.addEventListener("click", function () {
              filteringHeightORWeight(heavyPokemon);
              filterHeavy.setAttribute("filter", "active");
              filterHeavy.style.backgroundColor = "orange";
            });

            filterMediumWeight.addEventListener("click", function () {
              filteringHeightORWeight(mediumWeightPokemon);
              filterMediumWeight.setAttribute("filter", "active");
              filterMediumWeight.style.backgroundColor = "orange";
            });

            filterLight.addEventListener("click", function () {
              filteringHeightORWeight(lightPokemon);
              filterLight.setAttribute("filter", "active");
              filterLight.style.backgroundColor = "orange";
            });

            advancedSearchBtn.addEventListener("click", function (e) {
              let filterActiveCheck =
                advancedSearchBlock.getAttribute("filter");
              lowestToHighest.setAttribute("selected", "null");
              highestToLowest.setAttribute("selected", "null");
              a_to_z.setAttribute("selected", "null");
              z_to_a.setAttribute("selected", "null");

              if (filterActiveCheck) {
                let count = 0;
                advancedSearchBtnFunction(count, displayCounter);
              } else {
                resetData();
              }
            });

            //reset buttons
            resetFilters.addEventListener("click", resetData);

            reset.addEventListener("click", resetData);

            search.addEventListener("click", function searchPokemonValue() {
              makeGrid(displayCounter);
            });

            //Lowest to highest sort filter
            lowestToHighest.addEventListener(
              "click",
              function lowestToHighestSort() {
                init();
                displayCounter = 16;
                lowestToHighest.setAttribute("selected", "selected");
                highestToLowest.setAttribute("selected", "null");
                a_to_z.setAttribute("selected", "null");
                z_to_a.setAttribute("selected", "null");
                advancedSearchBlock.removeAttribute("filter");

                makeGrid(displayCounter);
              }
            );

            //Highest to lowest sort filter
            highestToLowest.addEventListener(
              "click",
              function highestToLowestSort() {
                init();
                displayCounter = 16;
                highestToLowest.setAttribute("selected", "selected");
                lowestToHighest.setAttribute("selected", "null");
                a_to_z.setAttribute("selected", "null");
                z_to_a.setAttribute("selected", "null");
                advancedSearchBlock.removeAttribute("filter");

                for (
                  let c = myJson.length - 1, cNext = c - 1, count = 0;
                  c > 0 && count < displayCounter;
                  c--, cNext--
                ) {
                  count = displayIfSearchExists(c, cNext, count, false);
                }
                loadMorePokemonContainer.append(loadMorePokemon);
              }
            );

            // A To Z sort filter
            a_to_z.addEventListener("click", function aToZSort() {
              init();
              displayCounter = 16;
              a_to_z.setAttribute("selected", "selected");
              z_to_a.setAttribute("selected", "null");
              lowestToHighest.setAttribute("selected", "null");
              highestToLowest.setAttribute("selected", "null");
              advancedSearchBlock.removeAttribute("filter");

              sortedArray = sortingPokemonNames();

              for (
                let c = 0, cNext = 1, count = 0;
                c < pokemonDatabaseLength && count < displayCounter;

              ) {
                if (sortedArray[count] !== myJson[c].name) {
                  c++;
                } else {
                  count = displayIfSearchExists(c, cNext, count, false);
                  c = cNext;
                  cNext++;
                }
              }
              loadMorePokemonContainer.append(loadMorePokemon);
            });

            // Z To A sort filter
            z_to_a.addEventListener("click", function zToASort() {
              init();
              displayCounter = 16;
              z_to_a.setAttribute("selected", "selected");
              a_to_z.setAttribute("selected", "null");
              lowestToHighest.setAttribute("selected", "null");
              highestToLowest.setAttribute("selected", "null");
              advancedSearchBlock.removeAttribute("filter");

              sortedArray = sortingPokemonNames().reverse();

              for (
                let c = 0, cNext = 1, count = 0;
                c < pokemonDatabaseLength && count < displayCounter;

              ) {
                if (sortedArray[count] !== myJson[c].name) {
                  c++;
                } else {
                  count = displayIfSearchExists(c, cNext, count, false);
                  c = cNext;
                  cNext++;
                }
              }
              loadMorePokemonContainer.append(loadMorePokemon);
            });

            advancedSearchToggle.addEventListener(
              "click",
              function toggleAdvancedSearch(e) {
                this.classList.toggle("active");
                if (
                  e.target.classList.contains(
                    "advancedSearchNavigationBar--active"
                  )
                ) {
                  advancedSearchBlock.classList.remove(
                    "advancedSearchNavigationBar--active"
                  );
                } else {
                  advancedSearchBlock.classList.toggle(
                    "advancedSearchNavigationBar--active"
                  );
                  if (
                    advancedSearchBlock.classList.contains(
                      "advancedSearchNavigationBar--active"
                    )
                  ) {
                    reset.style.display = "inline-block";
                  } else {
                    reset.style.display = "none";
                  }
                }
              }
            );

            loadMorePokemon.addEventListener("click", function (e) {
              displayCounter += 16;
              init();
              makeGrid(displayCounter);
              loadMorePokemonContainer.append(loadMorePokemon);
            });
          })
          // end of Pokemon JSON fetch

          .catch((err) => {
            console.error(err);
          });
      })();
      //end of Pokemon JSON IIFE fetch call
    })
    .catch((err) => {
      console.log(err);
    });
};
