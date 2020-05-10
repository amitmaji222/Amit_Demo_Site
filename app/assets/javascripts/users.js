// ------------------------------------------------------------------------------
// Refer to ==>> "https://stripe.com/docs/stripe-js/v2" for more information.
// ------------------------------------------------------------------------------
// $ sign is defined somewhere else so the below line, as it says $ not defined. 
/* global $, Stripe */


// Document Ready {For more information : "https://stackoverflow.com/questions/36110789/rails-5-how-to-use-document-ready-with-turbo-links"}.
$( document).on('turbolinks:load', function(){
  var theForm = $('#pro_form');
  var submitBtn = $('#form-signup-btn');
  // Set Stripe public key.
  Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content') );
  
  // When the user clicks submit button,
  submitBtn.click(function(event){
    
    // prevent defaut submission behaviour.
    event.preventDefault();
    submitBtn.val('Processing').prop('disabled', true);
    
    // collect credit card fields.
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val();
        
    // Use Stripe JS library to check for card errors.
    var error = false;
    
    // Validate card number.
    if(!Stripe.card.validateCVC(cvcNum)){
      error = true;
      alert('The Credit card number appears to be invalid.')
    }
    
    // Validate CVC number.
    if(!Stripe.card.validateCardNumber(ccNum)){
      error = true;
      alert('The CVC number appears to be invalid.')
    }
    
    // Validate Expiration Date.
    if(!Stripe.card.validateExpiry(expMonth, expYear)){
      error = true;
      alert('The expiration date appears to be invalid.')
    }
    
    if(error){
      //  If there are errors ,don't send to Stripe.
      submitBtn.prop('disabled', false).val('Sign up');
    }    
    
    else{
    // send the card info to stripe.
    Stripe.card.createToken({
      number: ccNum,
      cvc: cvcNum,
      exp_month: expMonth,
      exp_year: expYear
    }, stripeResponseHandler);      
    }
  
  return false;
  
  })
    
  // Stripe will return a card token.
  function stripeResponseHandler(status, response) {
    // Get the token from the response.
    var token = response.id;
    
    // Inject card token as hidden field into form.
    theForm.append($('<input type = "hidden" name="user[stripe_card_token]">').val(token));
    // Submit form to our Rails app
    theForm.get(0).submit();
    // .get(0) refers to the position 1 inside an array.
  }
  
})
