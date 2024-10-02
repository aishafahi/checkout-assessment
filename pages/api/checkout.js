export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const { merchant_reference, amount, customer_email, order_description } = req.body;
  
        // Define your secret key for signing
        const secretKey = process.env.SECRET_KEY; // Use your actual secret key
  
        // Parameters to send to Payfort API
        const requestParams = {
          command: 'AUTHORIZATION',
          access_code: process.env.ACCESS_CODE, // Your access code
          merchant_identifier: process.env.MERCHANT_IDENTIFIER, // Your merchant identifier
          merchant_reference,
          amount,
          currency: 'AED',
          language: 'en',
          customer_email,
          order_description
        };
  
        // Generate a valid signature using request params
        requestParams.signature = generateSignature(requestParams, secretKey);
  
        // Make API call to Payfort
        const response = await fetch('https://sbcheckout.payfort.com/FortAPI/paymentPage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams(requestParams).toString(),
        });
  
        const data = await response.json();
  
        if (response.ok && data.status === '14') {
          // Payment approved
          res.status(200).json({ success: true, redirectUrl: '/order-confirmation' });
        } else {
          // Payment failed
          res.status(400).json({ success: false, redirectUrl: '/checkout?retry=true', error: data });
        }
      } catch (error) {
        res.status(500).json({ success: false, redirectUrl: '/checkout?retry=true', error: 'Please eneter valid secret key,Merchent identifier,Access code' });
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  
  // Complete generateSignature function
  function generateSignature(params, secretKey) {
    // Step 1: Sort the parameters alphabetically by key
    const sortedKeys = Object.keys(params).sort();
  
    // Step 2: Concatenate the parameters in the format key1=value1key2=value2...
    let stringToSign = '';
    sortedKeys.forEach((key) => {
      if (params[key]) { // Ensure no empty or null values are included
        stringToSign += `${key}=${params[key]}`;
      }
    });
  
    // Step 3: Prepend and append the secret key to the concatenated string
    stringToSign = `${secretKey}${stringToSign}${secretKey}`;
  
    // Step 4: Generate the SHA-256 hash of the string
    const hash = crypto.createHash('sha256');
    hash.update(stringToSign);
    const signature = hash.digest('hex'); // Generate the hex-encoded signature
  
    return signature;
  }
  