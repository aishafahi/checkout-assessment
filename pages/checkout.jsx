// pages/checkout.js
import { useRouter } from 'next/router';
import CheckoutForm from './checkoutform';

const CheckoutPage = () => {
  const router = useRouter();
  const { retry } = router.query;

  return (
    <div>
      {retry && <p style={{ color: 'red',textAlign: 'center' }}>Payment failed, please try again.</p>}
      <CheckoutForm />
    </div>
  );
};

export default CheckoutPage;
