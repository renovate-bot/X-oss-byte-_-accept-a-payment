document.addEventListener('DOMContentLoaded', async () => {
  // Load the publishable key from the server. The publishable key
  // is set in your .env file. In practice, most users hard code the
  // publishable key when initializing the Stripe object.
  const {publishableKey} = await fetch('/config').then(r => r.json());
  if(!publishableKey) {
    addMessage('No publishable key returned from the server. Please check `.env` and try again');
    alert('Please set your Stripe publishable API key in the .env file');
  }

  const stripe = Stripe(publishableKey);
  const url = new URL(window.location);
  const clientSecret = url.searchParams.get('payment_intent_client_secret');
  const {error, paymentIntent} = await stripe.retrievePaymentIntent(clientSecret);

  if(error) {
    addMessage(error.message);
  }

  addMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
});

// Helper for displaying status messages.
const addMessage = (message) => {
  const messagesDiv = document.querySelector('#messages')
  messagesDiv.innerHTML += `${message}<br>`;
  console.log(`Debug: ${message}`);
}