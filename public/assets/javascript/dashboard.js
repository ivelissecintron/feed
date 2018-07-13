// GET
$.get('/api/mealMaster', function(data) {
  for (var i = 0; i < data.length; i++) {
    var meal = $('<button>')
      .attr('value', data[i].meal)
      .addClass('list-group-item list-group-item-action meals')
      .text(data[i].meal);
    $('#foods').append(meal);
  }

  $('.meals').on('click', function(e) {
    e.preventDefault();
    let newMeal = $(this)
      .val()
      .trim();
    let userMeal = {
      UserId: localStorage.getItem('id'),
      meal: newMeal
    };
    // api/meals:
    // POST
    $.post('/api/meals', userMeal, function(data) {
      location.reload();
    });
  });
});

// api/users
// GET BY ID
$.get(`/api/users/${localStorage.getItem('id')}`, function(data) {
  for (var i = 0; i < data.Meals.length; i++) {
    let yourMeals = $('<li>')
      .addClass('list-group-item')
      .text(data.Meals[i].meal);
    $('#yourMealList').append(yourMeals);
  }
});

$('#genSeven').on('click', function(e) {
  e.preventDefault();
  $.get(`/api/users/${localStorage.getItem('id')}`, function(data) {
    for (var i = 0; i < data.Meals.length; i++) {
      const mealsList =
        data.Meals[i][Math.floor(Math.random(data.Meals.length * 7) + 1)];
      console.log(mealsList);
    }
  });
});
