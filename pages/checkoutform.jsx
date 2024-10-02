import { useState } from 'react';
import { useRouter } from 'next/router';
import './styles/checkout.css'

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    merchant_reference: 'XYZ9239-yu898',
    amount: 10000, // Amount in minor units (10000 = 100 AED)
    customer_email: 'aisha@payfort.com',
    order_description: 'iPhone 6-S'
  });

  const router = useRouter(); // To handle redirection

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to Order Confirmation Page if payment is successful
        router.push(data.redirectUrl);
      } else {
        // Redirect back to Checkout Page with retry parameter if payment fails
        router.push(data.redirectUrl);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle any other errors
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        <h2 className="form-title">Checkout Form</h2>
        
      <div>
        <label htmlFor="customer_email">Email</label>
        <input
          type="email"
          name="customer_email"
          value={formData.customer_email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="amount">Amount (in AED)</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="order_description">Order Description</label>
        <input
          type="text"
          name="order_description"
          value={formData.order_description}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">Submit Payment</button>
    </form>
  );
};

export default CheckoutForm;
