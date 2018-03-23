$(function() {

// create a variable for the endpoint
let TASTEDIVE_ENDPOINT = 'https://tastedive.com/api/similar',
    books;

// get the data from TasteDive API
function getDataFromApi(searchTerm, callback) {
    // create settings for the search
    const settings = {
      data: {
        q: `book:${searchTerm}`,
        info: 1,
        limit: 10,
        k: '303423-BookTast-BKJPLZCR',
        type: 'books'
      },
      headers : {
        'Access-Control-Allow-Origin' : '*'
      },
      dataType: 'jsonp',
      type: 'GET',
      success: callback
    };
    // perform an asynchronous HTTP request
    $.ajax(TASTEDIVE_ENDPOINT, settings);
  }



function loadResults(data) {
    console.log(data);
    let results = data.Similar.Results;
    console.log(results);
    let returnHTML = "";
    books = {};
    // loop through each item in the Results array
    results.forEach(function(item){
    // image
    // title
    // console.log(item.Name);
    returnHTML += `<div class="thumbnail">${item.Name}</div>`;
    books[item.Name] = item;
    // author
    // description
    // console.log(item.wTeaser);
    // // wiki page
    // console.log(item.wUrl);
    });

    $('.js-search-results').html(returnHTML);
}

$('body').on('click', '.thumbnail', function() {
    let clickedElement = $(this);
    console.log(clickedElement);
    let thisText = clickedElement.text();
    // alert(books[thisText]);
    let bookInfo = `<h3>${thisText}</h3>` +
        `<div>${books[thisText].wTeaser}</div>` +
        `<div><a href='${books[thisText].wUrl}' target='_blank'>Read More</a></div>`;
    $('.inner').append(bookInfo);
    $('.lightbox').css('display', 'block');
})

$('.inner > button').click(function() {
    $('.lightbox').css('display', 'none');
})

function watchSubmit() {
$('.js-search-form').on('submit', event => {
    event.preventDefault();
    // get the value of the user's input
    const queryTarget = $(event.currentTarget).find('.js-query');
    // create a variable for the user's input
    const query = queryTarget.val();
//   console.log(queryTarget.val());
    // clear the input
    queryTarget.val("");
    // call the function that gets TasteDive data using parameters of user's input and callback function to display results
    getDataFromApi(query, loadResults);
});
}

watchSubmit();


});