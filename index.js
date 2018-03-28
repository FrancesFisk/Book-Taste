$(function() {

// Variables
let TASTEDIVE_ENDPOINT = 'https://tastedive.com/api/similar',
    books,
    testing = true,
    lightboxAllow = true;

// get the data from TasteDive API
function getDatafromTDApi(searchTerm, callback) {
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

// Load thumbnail results
function loadResults(data) {
    let results = data.Similar.Results;
    if(results.length === 0) {
        console.log("if statement fail");
        //feedback that it failed
        return;
    }
    let returnHTML = "";
    books = {};
    // loop through each item in the Results array
    results.forEach(function(item){
    returnHTML += `<div class="thumbnail"><span>${item.Name}</span></div>`;
    books[item.Name] = item;
    });

    $('.js-search-results').html(returnHTML);
    $('.results-bar').removeAttr('hidden').addClass('open');
    $('.js-search-results').addClass('show');
    $('html, body').animate({                           
        scrollTop: $(".results-bar").offset().top                 
    }, 2000);
    if (testing && lightboxAllow) {
        lightbox("Carrie");
    }
}

// Fill lightbox with info
function lightbox(query) {
    let tasteDiveInfo = `<h3>${query}</h3>` +
            `<div>${books[query].wTeaser}</div>` +
            `<div class="wiki-link"><a href='${books[query].wUrl}' target='_blank'>Read more <i class="fas fa-external-link-alt"></i></a></div>`;
        $('.lightbox-content').html(tasteDiveInfo);
        $('.lightbox').css('display', 'block');
}

// Make thumbnail clickable to open its lightbox
$('body').on('click', '.thumbnail', function() {
    let clickedElement = $(this);
    let thisText = clickedElement.text();
    lightbox(thisText);
})

// Activate close button in lightbox
$('.inner-lightbox > button').click(function() {
    $('.lightbox').css('display', 'none');
})

// Fill results bar
function insertSearchTermOnPage(searchTerm) {
    $('.results-bar span span').text(capitalize(searchTerm));
}

// Activate search button
function watchSubmit() {
    $('.js-search-form').on('submit', event => {
        event.preventDefault();
        // get the value of the user's input
        const queryTarget = $(event.currentTarget).find('.js-query');
        // create a variable for the user's input
        const query = queryTarget.val();
        // clear the input
        queryTarget.val("");
        insertSearchTermOnPage(query);
        // call the function that gets TasteDive data using parameters of user's input and callback function to display results
        getDatafromTDApi(query, loadResults);
    });
}

// Clear thumbnail results
$('body').on('click', '.clear-btn', function(e) {
    e.preventDefault();
    clearResults();
    }
)

function clearResults() {
    $('.results-bar').removeClass('open').hide();
    $('.js-search-results').removeClass('show').empty();
}

// Capitalize the user's book title
function capitalize(string) {
    return string.replace(/ +/g, " ").split(" ").map(function(item) {
        return item.charAt(0).toUpperCase() + item.substring(1);
    }).join(" ");
}

// Add border when mouseover thumbnails
$('body').on('mouseover', '.thumbnail', function() {
    $(this).addClass('thumbnail-border');
})

$('body').on('mouseout', '.thumbnail', function() {
    if($(this).hasClass('thumbnail-border')) {
        $(this).removeClass('thumbnail-border');
    }
})

watchSubmit();
if (testing) { 
    getDatafromTDApi("The Shining", loadResults);
}

});


function getDataFromGBApi(searchTerm, callback) {
   let GOOGLEBOOKS_ENDPOINT = 'https://www.googleapis.com/books/v1/volumes';
    // create settings for the search
    const settings = {
    data: {
        q: `${searchTerm}`,
        maxResults: 1,
        key: 'AIzaSyALdsddcNM1-QAgR3QtjlsjF8fiR-LEq8c',
    },
    dataType: 'json',
    type: 'GET',
    success: callback
    };
    // perform an asynchronous HTTP request
    $.ajax(GOOGLEBOOKS_ENDPOINT, settings);
}

function loadGBResults(data) {
    let results = data.items[0].volumeInfo.authors;
    console.log("google books results", results);
}


getDataFromGBApi("carrie", loadGBResults);