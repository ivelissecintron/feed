// GET
$(document).ready(function() {
  $.get("/api/mealMaster", function(data) {
    for (var i = 0; i < data.length; i++) {
      var meal = $("<li>")
        .attr("value", data[i].meal)
        .addClass("list-group-item list-group-item-action meals")
        .text(data[i].meal);
      $("#foods").append(meal);
    }

    $(".meals").on("click", function(e) {
      e.preventDefault();
      let newMeal = $(this).attr("value");
      let userMeal = {
        UserId: localStorage.getItem("id"),
        meal: newMeal
      };
      // api/meals:
      // POST
      $.post("/api/meals", userMeal, function(data) {
        location.reload();
      });
    });
  });

  // api/users
  // GET BY ID
  $.get(`/api/users/${localStorage.getItem("id")}`, function(data) {
    for (var i = 0; i < data.Meals.length; i++) {
      let yourMeals = $("<li>")
        .addClass("list-group-item hover-meal")
        .text(data.Meals[i].meal)
        .attr("value", data.Meals[i].id);
      $("#yourMealList").append(yourMeals);
    }
    $(".hover-meal").on("click", function() {
      const val = $(this).val();
      console.log(val);
      $.ajax({
        url: `/api/meals/${val}`,
        type: "DELETE"
      });
      window.location.reload();
    });
  });

  const generateMeals = e => {
    e.preventDefault();
    $.get(`/api/users/${localStorage.getItem("id")}`, function(data) {
      let mealsArray = [];
      for (var i = 0; i < data.Meals.length; i++) {
        mealsArray.push(data.Meals[i].meal);
      }
      const currentMeals = [];
      const generatedMeals = () => {
        const aMeal = mealsArray[Math.floor(Math.random() * mealsArray.length)];
        currentMeals.push(aMeal);
      };
      for (var j = 0; j < 7; j++) {
        generatedMeals();
      }

      const getMeal = mealName => {
        return localStorage.getItem(mealName);
      };
      for (var a = 1; a < 8; a++) {
        var b = a - 1;
        localStorage.removeItem(`meal${a}`);
        localStorage.setItem(`meal${a}`, currentMeals[b]);
        $(`#food${a}`).text(getMeal(`meal${a}`));
        $(`#recipeBtn${a}`).attr("value", currentMeals[b]);
      }
    });
  };

  $("#genSeven").on("click", function(e) {
    generateMeals(e);
    window.location.reload();
  });

  $("#genAgain").on("click", function(e) {
    generateMeals(e);
    window.location.reload();
  });

  $("#mealSubmitBtn").on("click", function(e) {
    console.log(`clicked`);
    e.preventDefault();
    let userMeal = {
      UserId: localStorage.getItem("id"),
      meal: $("#ownMeal")
        .val()
        .trim()
    };
    $.post("/api/meals", userMeal, function(data) {
      location.reload();
      $.get(`/api/users/${localStorage.getItem("id")}`, function(data) {
        for (var i = 0; i < data.Meals.length; i++) {
          let yourMeals = $("<li>")
            .addClass("list-group-item")
            .text(data.Meals[i].meal);
          $("#yourMealList").append(yourMeals);
        }
      });
    });
  });

  $("#logout").on("click", function(e) {
    e.preventDefault();
    window.location.replace("/");
  });
});

const persistentMeals = () => {
  const setMeals = () => {
    const getMeal = mealName => {
      return localStorage.getItem(mealName);
    };
    for (var a = 1; a < 8; a++) {
      $(`#food${a}`).text(getMeal(`meal${a}`));
      $(`#recipeBtn${a}`).attr("value", getMeal(`meal${a}`));
    }
    const genMealLinks = () => {
      const mealLink = a => {
        let meal = $(`#recipeBtn${a}`).attr("value");
        const concatMeal = meal.split(" ").join("+");
        const queryURL = `http://api.yummly.com/v1/api/recipes?_app_id=c80eb1dc&_app_key=bcb2227975b7e809f5979400cec566a4&q=${concatMeal}`;
        $.get(queryURL, function(data) {
          console.log(data.matches[0].id);
          $(`#recipeBtn${a}`).attr(
            "href",
            `https://www.yummly.com/recipe/${data.matches[0].id}`
          );
        });
      };
      for (var z = 1; z < 8; z++) {
        mealLink(z);
      }
    };
    genMealLinks();
  };

  const mealUno = localStorage.getItem("meal1");
  mealUno ? setMeals() : null;
};

persistentMeals();
