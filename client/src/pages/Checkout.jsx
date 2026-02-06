import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Truck, Check } from "lucide-react";
import { Container } from "../components/layout";
import { useCart } from "../hooks/useCart";
import { useOrders } from "../hooks/useOrders";
import { formatCurrency } from "../utils/formatters";
import { isValidEmail, isValidZipCode } from "../utils/validators";

function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, tax, total, clearCart } = useCart();
  const { createOrder } = useOrders();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateShipping = () => {
    const newErrors = {};
    if (!formData.email || !isValidEmail(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zipCode || !isValidZipCode(formData.zipCode)) {
      newErrors.zipCode = "Valid ZIP code is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    if (!formData.cardNumber || formData.cardNumber.length < 16) {
      newErrors.cardNumber = "Valid card number is required";
    }
    if (!formData.expiry) newErrors.expiry = "Expiry date is required";
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = "Valid CVV is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateShipping()) {
      setStep(2);
    } else if (step === 2 && validatePayment()) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        totalAmount: total,
      };

      const result = await createOrder(orderData);
      if (result.success) {
        clearCart();
        setStep(3);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== 3) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[
            { num: 1, label: "Shipping", icon: Truck },
            { num: 2, label: "Payment", icon: CreditCard },
            { num: 3, label: "Confirmation", icon: Check },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= s.num
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <s.icon className="w-5 h-5" />
              </div>
              <span
                className={`ml-2 font-medium ${
                  step >= s.num ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {s.label}
              </span>
              {i < 2 && (
                <div
                  className={`w-16 h-1 mx-4 ${
                    step > s.num ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`input ${errors.email ? "border-red-500" : ""}`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`input ${errors.firstName ? "border-red-500" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`input ${errors.lastName ? "border-red-500" : ""}`}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`input ${errors.address ? "border-red-500" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`input ${errors.city ? "border-red-500" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`input ${errors.state ? "border-red-500" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={`input ${errors.zipCode ? "border-red-500" : ""}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Payment Details
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        maxLength={16}
                        className={`input ${errors.cardNumber ? "border-red-500" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={handleChange}
                        className={`input ${errors.expiry ? "border-red-500" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleChange}
                        maxLength={4}
                        className={`input ${errors.cvv ? "border-red-500" : ""}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Order Confirmed!
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Thank you for your purchase. You will receive an email
                    confirmation shortly.
                  </p>
                  <button
                    onClick={() => navigate("/orders")}
                    className="btn-primary"
                  >
                    View Orders
                  </button>
                </div>
              )}

              {step < 3 && (
                <div className="flex gap-4 mt-8">
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="btn-outline"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={handleNextStep}
                    disabled={loading}
                    className="flex-1 btn-primary"
                  >
                    {loading
                      ? "Processing..."
                      : step === 2
                        ? "Place Order"
                        : "Continue to Payment"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          {step < 3 && (
            <div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default Checkout;
