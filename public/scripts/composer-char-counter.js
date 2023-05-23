//update the character counter in the new tweet field on input

$(document).ready(function() {
  const maxLength = 140;
  const counter = $('output.counter');

  $('textarea#tweet-text').on('input', function() {
    let text = $(this).val();
    let count = text.length;
    let remainingChars = maxLength - count;

    counter.text(remainingChars);

    if (remainingChars < 0) {
      counter.addClass('count-exceeded');
    } else {
      counter.removeClass('count-exceeded');
    }

  });
});
