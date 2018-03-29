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

// OLD LIGHTBOX Fill lightbox with info
// function lightbox(query) {
//     let tasteDiveInfo = `<h3>${query}</h3>` +
//             `<div>${books[query].wTeaser}</div>` +
//             `<div class="wiki-link"><a href='${books[query].wUrl}' target='_blank'>Read more <i class="fas fa-external-link-alt"></i></a></div>`;
//         $('.lightbox-content').html(tasteDiveInfo);
//         $('.lightbox').css('display', 'block');
// }

function lightbox(query) {
  let googleBooksInfo = `<div class="naccs">
        <div class="grid">
        <div class="gc gc--1-of-3">
            <div class="menu">
            <div class="active"><span class="light"></span><span>Beer</span></div>
            <div><span class="light"></span><span>Vine</span></div>
            <div><span class="light"></span><span>Lemonade</span></div>
            </div>
        </div>
        <div class="gc gc--2-of-3">
            <ul class="nacc">
            <li class="active">
            <div>
            <p>Beer is the world's oldest[1][2][3] and most widely consumed[4] alcoholic drink; it is the third most popular drink overall, after water and tea.[5] The production of beer is called brewing, which involves the fermentation of sugars, mainly derived
                from cereal grain starches—most commonly from malted barley, although wheat, maize (corn), and rice are widely used.[6] Most beer is flavoured with hops, which add bitterness and act as a natural preservative, though other flavourings such as
                herbs or fruit may occasionally be included. The fermentation process causes a natural carbonation effect, although this is often removed during processing, and replaced with forced carbonation.[7] Some of humanity's earliest known writings refer
                to the production and distribution of beer: the Code of Hammurabi included laws regulating beer and beer parlours,[8] and "The Hymn to Ninkasi", a prayer to the Mesopotamian goddess of beer, served as both a prayer and as a method of remembering
                the recipe for beer in a culture with few literate people.[9][10]</p>
            </div>
            </li>
            <li>
            <div>
            <p>A vine (Latin vīnea "grapevine", "vineyard", from vīnum "wine") in the narrowest sense is the grapevine (Vitis), but more generally it can refer to any plant with a growth habit of trailing or scandent (that is, climbing) stems, lianas or runners.
                The word also can refer to such stems or runners themselves, for instance when used in wicker work.[1][2] In the United Kingdom, the term "vine" applies almost exclusively to the grapevine. The term "climber" is used for all climbing plants.[3]</p>
            </div>
            </li>
            <li>
            <div>
            <p>Lemonade is any of various sweetened beverages found around the world, all characterized by lemon flavor. Most lemonade varieties can be separated into two distinct types: cloudy and clear; each is known simply as "lemonade" (or a cognate) in countries
                where dominant.[1] Cloudy lemonade, generally found in North America and India, is a traditionally homemade drink made with lemon juice, water, and sweetener such as cane sugar or honey.[2] Found in the United Kingdom, Ireland, South Africa, Australia,
                and New Zealand, clear lemonade is a lemon flavoured carbonated soft drink. Not to be confused with Sprite a lemon-lime flavored, soft drink.</p>
            </div>
            </li>
            </ul>
        </div>
        </div>
        </div>`
        $('.lightbox-content').html(googleBooksInfo);
        $('.lightbox').css('display', 'block');
}

// Accordian
// Acc
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
    let results = data.items[0].volumeInfo.authors;
    console.log("google books results", results);
}


getDataFromGBApi("carrie", loadGBResults);