let containerFavPokemon = document.getElementById("container-favorite-pokemon");
let body = document.getElementsByTagName("body")[0];

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
    alert("Your login session time has run out");
    window.location.assign("http://127.0.0.1:5500/views/main.html");
  }

  let myJson = await fetch(
    "https://cors-anywhere-server.fly.dev/https://www.pokemon.com/us/api/pokedex/kalos"
  )
    .then((res) => {
      return res.json();
    })
    .then((myJson) => {
      displayFavoritesFn(); //function to display favorites for each set

      async function displayFavoritesFn(e) {
        //fetch call to get favorites of each user
        let favoritePokemonArray = await fetch(
          "http://localhost:3000/users/favPokemonArray",
          {
            headers: { Authorization: `Bearer ${getCookie("access_token")}` },
          }
        )
          .then((res) => {
            return res.json();
          })
          .catch((err) => {
            console.error(err);
          });

        console.log("favoritePokemonArray", favoritePokemonArray);

        //for of to differentiate and display sets
        for (const [key, value] of Object.entries(favoritePokemonArray)) {
          let nextKey = +key + 1;
          console.log(value, favoritePokemonArray[nextKey]);
          if (value !== favoritePokemonArray[nextKey]) {
            //creating a new div-element for each set
            let groupDiv = document.createElement("div");
            groupDiv.setAttribute("id", `sets-of-six`);
            body.appendChild(groupDiv);

            let groupName = document.createElement("label");
            console.log("groupName", value.groupName);
            groupName.innerHTML = value.groupName;
            groupDiv.append(groupName);

            //display each favorite pokemon of that set
            value.fav_pokemon.forEach((element) => {
              pokemonDisplayFavorites(element.accessKey);
            });

            function pokemonDisplayFavorites(c) {
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

              ul.append(li);
              groupDiv.appendChild(ul);
            }
            continue;
          }
        }
      }
      return myJson;
    })
    .catch((err) => {
      console.log(err);
    });
  //end of JSON fetch
}; //end of onload function
