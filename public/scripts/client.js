/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(() => {

  const renderTweets = function(tweets) {
    // loops through tweets
    for (let tweet in tweets) {
      // calls createTweetElement for each tweet
      const formattedTweet = createTweetElement(tweets[tweet]);
      // takes return value and appends it to the tweets container
      $('.tweet-container').prepend(formattedTweet);
    }
    return;
  };

  const createTweetElement = function(tweet) {
    // Sanitize user-generated content using DOMPurify
    const sanitizedUserName = DOMPurify.sanitize(tweet.user.name);
    const sanitizedHandle = DOMPurify.sanitize(tweet.user.handle);
    const sanitizedText = DOMPurify.sanitize(tweet.content.text);
    const sanitizedCreatedAt = DOMPurify.sanitize(timeago.format(tweet.created_at));

    let $tweet = `
      <article class="tweet">
        <header>
          <div>
            <img class="tweet-user-icon" src="${tweet.user.avatars}">
            <p>${sanitizedUserName}</p>
          </div>
          <p class="user-handle">${sanitizedHandle}</p>
        </header>
        <div class="tweet-content">
          <p>${sanitizedText}</p>
        </div>
        <footer>
          <p>${sanitizedCreatedAt}</p>
          <p class="icons">
            <i class="fa-solid fa-flag"></i>
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
    const $form = $(this);
    const tweetData = $form.find('#tweet-text').val().trim();

    const createModal = (tweetLength) => {
      let $modal = $(`<div class="modal">
        <div class="modal-content">
          <button class="close-button"> X </button>
          <p><i class="fa-solid fa-triangle-exclamation"></i></p>
        </div>`);

      let $para = $modal.find('p');

      if (tweetLength > 140) {
        $para.append("Woah there! Your tweet is on the verge of starting a novel. Keep it to 140 characters or less.");
      }

      if (tweetLength === 0) {
        $para.append("Uh-oh! It seems your tweet is feeling shy and speechless. Please enter some words and hit that tweet button!");
      }

      return $modal;
    };

    const showModal = (tweetLength) => {
      const $modal = createModal(tweetLength);
      $('main').prepend($modal);
      return $modal;
    };

    const validateTweet = (tweetData) => {
      if (tweetData.length > 140 || tweetData.length === 0) {
        return false;
      }
      return true;
    };

    $('#new-tweet').submit(function(event) {
      event.preventDefault();
      const $form = $(this);
      const tweetData = $form.find('#tweet-text').val().trim();

      const $existingModal = $('main').find('.modal');
      if ($existingModal.length) {
        $existingModal.remove();
        return;
      }

      if (!validateTweet(tweetData)) {
        const $modal = showModal(tweetData.length);
        $modal.on('click', '.close-button', () => {
          $modal.slideUp();
        });
        return;
      }

      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: $form.serialize(),
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

      $('#tweet-text').val("");
      $('.counter').val(140);
    });
  });
});