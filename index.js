$(function() {

// VARIABLES
let TASTEDIVE_ENDPOINT = 'https://tastedive.com/api/similar',
    GOOGLEBOOKS_ENDPOINT = 'https://www.googleapis.com/books/v1/volumes',
    books,
    testing = false,
    testGBdata = false,
    lightboxAllow = false,
    noResultsBarAllow = false;


// EVENT HANDLERS

// Add border when mouseover thumbnails
$('body').on('mouseover', '.thumbnail', function() {
    $(this).addClass('thumbnail-border');
})

// Remove border when move away from thumbnails
$('body').on('mouseout', '.thumbnail', function() {
    if($(this).hasClass('thumbnail-border')) {
        $(this).removeClass('thumbnail-border');
    }
})

// Clear thumbnail results
$('body').on('click', '.clear-btn', function(e) {
    e.preventDefault();
    clearResults();
    }
)

// Open the lightbox
$('body').on('click', '.thumbnail', function(e) {
    openLightbox(this);
})

$('body').on('keypress', '.thumbnail', function(e){
    if(e.which === 13){//Enter key pressed
        openLightbox(this);
    }
});

// Open lightbox tabs
$(document).on('click', '.naccs .menu div', function() {
    lightboxTabs(this);
});

$(document).on('keypress', '.naccs .menu div', function(e) {
    if(e.which === 13) {//Enter key pressed
        lightboxTabs(this);
    }   
});

// Close button in lightbox
$('.inner-lightbox > button').click(function() {
    $('.lightbox').css('display', 'none');
})


// FUNCTIONS

// Get data from TasteDive API
function getDataFromTDApi(searchTerm, callback) {
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
    $.ajax(TASTEDIVE_ENDPOINT, settings);
  }

// Activate search button
function watchSubmit() {
    $('.js-search-form').on('submit', event => {
        event.preventDefault();
        clearResults();
        // get the value of the user's input
        const queryTarget = $(event.currentTarget).find('.js-query');
        // create a variable for the user's input
        const query = queryTarget.val();
        // clear the input
        queryTarget.val("");
        insertSearchTermOnPage(query);
        // call the function that gets TasteDive data using parameters of user's input and callback function to display results
        getDataFromTDApi(query, loadResults);
    });
}

// Load book recommendations results
function loadResults(data) {
    let results = data.Similar.Results;
    // If there are no recommendations results
    if(results.length === 0) {
        clearResults();
        $('.no-results-bar').removeAttr('hidden').addClass('open');
        let noResultsBarHeight = $('.no-results-bar').height();
        $('html, body').animate({                           
            scrollTop: noResultsBarHeight            
        }, 1000);
    } else {
        let returnHTML = "";
        books = {};
        // loop through each book recommendation/item in the Results array
        results.forEach(function(item){
        returnHTML += `<div class="thumbnail" tabindex="0"><span>${item.Name}</span></div>`;
        books[item.Name] = item;
        });
        clearResults();
        $('.results-bar').removeAttr('hidden').addClass('open');
        $('.js-search-results').html(returnHTML);
        $('.js-search-results').addClass('show');
        $('html, body').animate({                           
            scrollTop: $('.results-bar').offset().top                 
        }, 1000);
    }
    // testing the lightbox
    if (testing && testGBdata && lightboxAllow) {
        lightbox("Carrie");
    }
}

// Fill results bar
function insertSearchTermOnPage(searchTerm) {
    $('.results-bar-content span span').text(capitalize(searchTerm));
    $('.no-results-bar-content span span').text(capitalize(searchTerm));
}

// Clear results
function clearResults() {
    $('.results-bar').removeClass('open').prop('hidden', 'hidden');
    $('.no-results-bar').removeClass('open').prop('hidden', 'hidden');
    $('.js-search-results').removeClass('show').empty();
}

// Capitalize the user's book title
function capitalize(string) {
    return string.replace(/ +/g, " ").split(" ").map(function(item) {
        return item.charAt(0).toUpperCase() + item.substring(1);
    }).join(" ");
}

// Get data from Google Books Api 
function getDataFromGBApi(searchTerm, callback) {
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
    $.ajax(GOOGLEBOOKS_ENDPOINT, settings);
}

// Load Google Books data
function loadGBResults(data) {
    let bookDetails = {
    title: data.items[0].volumeInfo.title,
    author: data.items[0].volumeInfo.authors,
    publishedDate: data.items[0].volumeInfo.publishedDate,
    bookCover: data.items[0].volumeInfo.imageLinks.thumbnail,
    description: data.items[0].volumeInfo.description
    };
    lightbox(bookDetails);
}

// Display lightbox
function lightbox(book) {
    let displayAccordion = `
        <div class="naccs">
            <div class="grid">
                <div class="gc gc--1-of-3">
                    <div class="menu">
                        <div class="active" tabindex="0"><span class="light"></span><span>Info</span></div>
                        <div tabindex="0"><span class="light"></span><span>Description</span></div>
                    </div>
                </div>
                <div class="gc gc--2-of-3">
                    <ul class="nacc">
                        <li class="active">
                            <div>
                                <img src='${book.bookCover}' alt='${book.title}' class="book-img">
                                <div class="book-info">
                                    <span class="book-title">${book.title}</span>
                                    <span class="book-author">By ${book.author}</span>
                                    <span class="published-date"> Published: ${book.publishedDate}</span>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p>
                                    <span class="book-description"></span>
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>`;
    $('.lightbox-content').html(displayAccordion);
    $('.lightbox').css('display', 'block');
    // If Google Books does not provide a book description
    if (book.description === undefined) {
        $('.book-description').html("Sorry, there is no description available for this book.");
    } else {
        $('.book-description').html(book.description);
    }
}

// Open the lightbox
function openLightbox(clickedElement) {
    let thisText = $(clickedElement).text();
    getDataFromGBApi(thisText, loadGBResults);
}

// Open lightbox tabs
function lightboxTabs(tabChosen) {
    // Lightbox tabs by Benjamin Koehler
	var numberIndex = $(tabChosen).index();
	if (!$(tabChosen).is('active')) {
		$(".naccs .menu div").removeClass("active");
		$(".naccs ul li").removeClass("active");

		$(tabChosen).addClass("active");
		$(".naccs ul").find("li:eq(" + numberIndex + ")").addClass("active");

		var listItemHeight = $(".naccs ul")
			.find("li:eq(" + numberIndex + ")")
			.innerHeight();
		$(".naccs ul").height(listItemHeight + "px");
	}
}

// Get ready for user to submit a book title
watchSubmit();


// Testing
if (testing) { 
    getDataFromTDApi("The Shining", loadResults);
}

if (testGBdata) {
    getDataFromGBApi("TheShining");
}

if (noResultsBarAllow) {
    getDataFromTDApi("dfsjlkdjfsl", loadResults);
}

});