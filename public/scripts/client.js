/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(() => {
  //CREATE TWEET ELEMENT TO GO IN TWEETS ON PAGE: 
  // Fake data taken from initial-tweets.json
  // const data = [
  //   {
  //     "user": {
  //       "name": "Newton",
  //       "avatars": "https://i.imgur.com/73hZDYK.png"
  //       ,
  //       "handle": "@SirIsaac"
  //     },
  //     "content": {
  //       "text": "If I have seen further it is by standing on the shoulders of giants"
  //     },
  //     "created_at": 1461116232227
  //   },
  //   {
  //     "user": {
  //       "name": "Descartes",
  //       "avatars": "https://i.imgur.com/nlhLi3I.png",
  //       "handle": "@rd"
  //     },
  //     "content": {
  //       "text": "Je pense , donc je suis"
  //     },
  //     "created_at": 1461113959088
  //   }
  // ];

  const renderTweets = function(tweets) {
    // loops through tweets
    for (let tweet in tweets) {
      // calls createTweetElement for each tweet
      const formattedTweet = createTweetElement(tweets[tweet]);
      // takes return value and appends it to the tweets container
      $('.tweet-container').append(formattedTweet);
    }
    return;
  };

  const createTweetElement = function(tweet) {
    let $tweet = `
  <article class="tweet">
      <header>
        <div>
          <img class="tweet-user-icon" src="${tweet.user.avatars}">
          <p>${tweet.user.name}</p>
        </div>
        <p class="user-handle">${tweet.user.handle}</p>
      </header>
      <div class="tweet-content">
        <p> ${tweet.content.text} </p>
      </div>
      <footer>
        <p> ${tweet.created_at} </p>
        <p class="icons"> <i class="fa-solid fa-flag"></i>
          <i class="fa-sharp fa-solid fa-retweet"></i>
          <i class="fa-solid fa-heart"></i>
        </p>
      </footer>
    </article>`;
    return $tweet;
  };

  const loadTweets = () => {
    $.get('/tweets', function(response) {
      renderTweets(response);
    }).fail(function(xhr, status, error) {
      console.log('GET request failed');
      console.log(error);
    });
  };

  $('#new-tweet').submit(function(event) {
    event.preventDefault();
    const tweetData = $(this).serialize();
    console.log(tweetData);

    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: tweetData,
      success: function(response) {
        console.log("Success");
        loadTweets();
      },
      error: function(xhr, status, error) {
        // Handle the error response
        console.log('POST request failed');
        console.log(error);
      }
    });
  });


  //renderTweets(data);


});

