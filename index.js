$(function() {

// create a variable for the endpoint
let TASTEDIVE_ENDPOINT = 'https://tastedive.com/api/similar',
    books,
    testing = true,
    lightboxAllow = false;

// get the data from TasteDive API
function getDataFromApi(searchTerm, callback) {
    // create settings for the search
    const settings = {
      data: {
        q: `book:${searchTerm}`,
        info: 1,
        limit: 12,
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
    returnHTML += `<div class="thumbnail"><span>${item.Name}</span></div>`;
    books[item.Name] = item;
    // author
    // description
    // console.log(item.wTeaser);
    // // wiki page
    // console.log(item.wUrl);
    });

    $('.js-search-results').html(returnHTML);
    $('.results-bar').removeAttr('hidden').addClass('open');
    $('.js-search-results').addClass('show');
    $('html, body').animate({                           
        scrollTop: $(".results-bar").offset().top                 
    }, 800);
    if (testing && lightboxAllow) {
        lightbox("Othello");
    }
}

function lightbox(query) {
    let bookInfo = `<h3>${query}</h3>` +
            `<div>${books[query].wTeaser}</div>` +
            `<div class="wiki-link"><a href='${books[query].wUrl}' target='_blank'>Read more <i class="fas fa-external-link-alt"></i></a></div>`;
        $('.lightbox-content').html(bookInfo);
        $('.lightbox').css('display', 'block');
}
    $('body').on('click', '.thumbnail', function() {
        let clickedElement = $(this);
        console.log(clickedElement);
        let thisText = clickedElement.text();
        lightbox(thisText);
    })


$('.inner-lightbox > button').click(function() {
    $('.lightbox').css('display', 'none');
})

function insertSearchTermOnPage(searchTerm) {
    $('.results-bar span span').text(capitalize(searchTerm));
}

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
        insertSearchTermOnPage(query);
        // call the function that gets TasteDive data using parameters of user's input and callback function to display results
        getDataFromApi(query, loadResults);
    });
}

$('body').on('click', '.clear-btn', function(e) {
    e.preventDefault();
    clearResults();
    }
)

function clearResults() {
    $('.results-bar').removeClass('open').attr('hidden', true);
    $('.js-search-results').removeClass('show').empty();
}

function capitalize(string) {
    let newString = [];
    let capString;
    let splitString = string.split(" ");
    for (let i = 0; i < splitString.length; i++) {
      capString = splitString[i].charAt(0).toUpperCase() + splitString[i].substring(1);
      newString.push(capString);
    }
    return (newString.join(" "));
}


watchSubmit();
if (testing) { 
    getDataFromApi("hamlet", loadResults);
}

});