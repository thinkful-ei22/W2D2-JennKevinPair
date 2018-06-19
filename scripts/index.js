'use strict';
/*eslint-env jquery*/
const API_KEY = 'AIzaSyAhWgsBh9umavp5wNC0uXCCNS4T0nH1UdY';
/*
  We want our store to hold a `videos` array of "decorated" objects - i.e. objects that
  have been transformed into just the necessary data to display on our page, compared to the large
  dataset Youtube will deliver to us.  Example object:
  
  {
    id: '98ds8fbsdy67',
    title: 'Cats dancing the Macarena',
    thumbnail: 'https://img.youtube.com/some/thumbnail.jpg'
  }

*/
const store = {
  videos: []
};

const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

const fetchVideos = function(searchTerm, callback) {//Create a `fetchVideos` function that receives a `searchTerm` and `callback`
  const query = {
    q: searchTerm,//Use `searchTerm` to construct the right query object based on the Youtube API docs
    part: 'snippet',
    key: API_KEY,
    type: 'video',
  };
  $.getJSON(BASE_URL, query, callback);//Make a getJSON call using the query object and sending the provided callback in as the last argument
};

const decorateResponse = function(response) {//Create a `decorateResponse` function that receives the Youtube API response
  return response.items.map(item => ( //Map through the response object's `items` array
    {
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
    }));//Return an array of objects, where each object contains the keys `id`, `title`, 
  // `thumbnail` which each hold the appropriate values from the API item object.
};

// const videos = decorateResponse();

const generateVideoItemHtml = function(video) { //Create a `generateVideoItemHtml` function that receives the decorated object
  return `
  <li data-id = "${video.id}">
    <h3>${video.title}</h3>
    <iframe width="560" height="315" src="http://www.youtube.com/embed/${video.id}" frameborder="0" 
    allow="autoplay; encrypted-media" allowfullscreen></iframe>
  </li>`; //Using the object, return an HTML string containing all the expected data
};
//<a href ="http://www.youtube.com/watch?v=${video.id}"> <img src = "${video.thumbnail}"></a>
{/* <iframe src="http://www.youtube.com/v/${video.id}"></iframe> */}
{/* <iframe width="560" height="315" src="https://www.youtube.com/embed/4sEV1lMn64k" frameborder="0" 
allow="autoplay; encrypted-media" allowfullscreen></iframe> */}

const addVideosToStore = function(videos) {//Create a `addVideosToStore` function that receives an array of decorated video 
// objects
  store.videos = videos;//sets the array as the value held in store.videos
};

const render = function() { //Create a `render` function
  const videoElements = store.videos.map(vid => {//Map through `store.videos`, sending each `video` through your `generateVideoItemHtml
    return generateVideoItemHtml(vid);
  });
  $('.results').html(videoElements);//Add your array of DOM elements to the appropriate DOM element
};

const handleFormSubmit = function() { //Create a `handleFormSubmit` function that adds an event listener to the form
  $('form').on('submit', function(event){
    event.preventDefault();//Prevent default event
    const searchTerm=$('#search-term').val(); //Retrieve the search input from the DOM
    $('#search-term').val('');//Clear the search input field
    fetchVideos(searchTerm, ((response)=>{ //Invoke the `fetchVideos` function, sending in the search value
      const results = decorateResponse(response); //Inside the callback, send the API response through the `decorateResponse` function
      console.log(response);
      addVideosToStore(results); //Inside the callback, add the decorated response into your store using the `addVideosToStore` function
      render(); //inside the callback, run the `render` function 
    }));
  });
};

// When DOM is ready:
$(function () {
  handleFormSubmit();//Run `handleFormSubmit` to bind the event listener to the DOM
});
