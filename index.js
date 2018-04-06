$(function() {

// Variables
let TASTEDIVE_ENDPOINT = 'https://tastedive.com/api/similar',
    books,
    testing = true,
    testGBdata = false,
    lightboxAllow = false,
    noResultsBarAllow = false;

// get the data from TasteDive API
function getDataFromTDApi(searchTerm, callback) {
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
        clearResults();
        $('.no-results-bar').removeAttr('hidden').addClass('open');
        let noResultsBarHeight = $('.no-results-bar').height();
        $('html, body').animate({                           
            scrollTop: noResultsBarHeight            
        }, 1000);
    } else {
        let returnHTML = "";
        books = {};
        // loop through each item in the Results array
        results.forEach(function(item){
        returnHTML += `<div class="thumbnail" tabindex="0" aria-pressed="false"><span>${item.Name}</span></div>`;
        books[item.Name] = item;
        });
        clearResults();
        $('.results-bar').removeAttr('hidden').addClass('open');
        $('.js-search-results').html(returnHTML);
        $('.js-search-results').addClass('show');
        $('html, body').animate({                           
            scrollTop: $(".results-bar").offset().top                 
        }, 1000);
    }

    if (testing && testGBdata && lightboxAllow) {
        lightbox("Carrie");
    }
}

function lightbox(book) {
    console.log("lightbox ", book);
    let displayAccordion = `
     <div class="naccs">
        <div class="grid">
            <div class="gc gc--1-of-3">
                <div class="menu">
                <div class="active"><span class="light"></span><span>Info</span></div>
                <div><span class="light"></span><span>Description</span></div>
                </div>
            </div>
            <div class="gc gc--2-of-3">
                <ul class="nacc">
                    <li class="active">
                        <div>
                            <p>
                                <img src='${book.bookCover}' alt='${book.title}' class="book-img">
                                <span class="book-title">${book.title}</span>
                                <span class="book-author">By ${book.author}</span>
                                <span class="published-date"> Published: ${book.publishedDate}</span>
                            </p>
                        </div>
                    </li>
                    <li>
                        <div>
                            <p>
                                <span class="book-description">${book.description}</span>
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>`;
        $('.lightbox-content').html(displayAccordion);
        $('.lightbox').css('display', 'block');
}

// Accordion tabs
$(document).on("click", ".naccs .menu div", function() {
	var numberIndex = $(this).index();

	if (!$(this).is("active")) {
		$(".naccs .menu div").removeClass("active");
		$(".naccs ul li").removeClass("active");

		$(this).addClass("active");
		$(".naccs ul").find("li:eq(" + numberIndex + ")").addClass("active");

		var listItemHeight = $(".naccs ul")
			.find("li:eq(" + numberIndex + ")")
			.innerHeight();
		$(".naccs ul").height(listItemHeight + "px");
	}
});


// Open lightbox
$('body').on('click', '.thumbnail', function() {
    let clickedElement = $(this);
    let thisText = clickedElement.text();
    getDataFromGBApi(thisText, loadGBResults);
})

$('body').on('keypress', '.thumbnail', function(e){
    console.log(e.which);
    if(e.which == 13){//Enter key pressed
        let clickedElement = $(this);
        let thisText = clickedElement.text();
        getDataFromGBApi(thisText, loadGBResults);
    }
});

// Activate close button in lightbox
$('.inner-lightbox > button').click(function() {
    $('.lightbox').css('display', 'none');
})

// Fill results bar
function insertSearchTermOnPage(searchTerm) {
    $('.results-bar-content span span').text(capitalize(searchTerm));
    $('.no-results-bar-content span span').text(capitalize(searchTerm));
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

// Clear thumbnail results
$('body').on('click', '.clear-btn', function(e) {
    e.preventDefault();
    clearResults();
    }
)

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
    getDataFromTDApi("The Shining", loadResults);
}

if (testGBdata) {
    getDataFromGBApi("TheShining");
}

if (noResultsBarAllow) {
    getDataFromTDApi("dfsjlkdjfsl", loadResults);
}





// Get the Google Books Api to work
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
    let bookInfo = {
    title: data.items[0].volumeInfo.title,
    author: data.items[0].volumeInfo.authors,
    publishedDate: data.items[0].volumeInfo.publishedDate,
    bookCover: data.items[0].volumeInfo.imageLinks.thumbnail,
    description: data.items[0].volumeInfo.description
    };
    console.log("google books results", bookInfo);
    lightbox(bookInfo);
}


// getDataFromGBApi("carrie", loadGBResults);

});