"use client";

import { useRouter } from 'next/navigation'; // Use from next/navigation
import { useState } from 'react'
import { CreditCard, Building, DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchParams } from 'next/navigation'

export default function CreditCardForm() {
  const [cardNumber, setCardNumber] = useState('')
  const [expirationMonth, setExpirationMonth] = useState('')
  const [expirationYear, setExpirationYear] = useState('')
  const [cvc, setCvc] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get('returnUrl') || '';
  const merchantName = searchParams?.get('merchantName') || 'Vercel Pizza Ltd.';
  const paymentAmount = parseFloat(searchParams?.get('paymentAmount')??'0');

  const validCardNumber = '4242 4242 4242 4242';

  const formatCardNumber = (input: string) => {
    const cleaned = input.replace(/\D/g, '')
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ')
    return formatted.slice(0, 19) // Limit to 16 digits (19 characters including spaces)
  }

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (cardNumber !== validCardNumber) {
      setPaymentFailed(true);
      console.log(`Error: Payment failed. Expected: ${validCardNumber}, got: ${cardNumber}`);
      await new Promise(resolve => setTimeout(resolve, 3000)).then(() => {
      const redirect = `${returnUrl}?error=Payment failed`
      console.log('Redirecting to:', redirect);
      router.push(redirect);
      });
    } else {

      console.log('Payment processing...');
      
      const response = await fetch('/api/token', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({
        //   token: cardNumber,
        //   amount: 500,
        // }),
      });
      
      const result = await response.json();

      console.log(result);

      const redirect = returnUrl.replace(/\/$/, "");

      try {
        if (result.token) {
          setPaymentSucceeded(true);
          console.log('Payment successful');
          await new Promise(resolve => setTimeout(resolve, 3000)).then(() => {
            router.push(`${redirect}?token=${result.token}`);
          });
        } else {
          setPaymentFailed(true);
          console.log('Error:', result.reason);
          await new Promise(resolve => setTimeout(resolve, 3000)).then(() => {
            console.error('Error:', result.reason);
            router.push(`${redirect}?error=${result.reason}`);
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } 
    }
  };

  function Footer() {
      if (paymentSucceeded) {
        return (
          <div className="text-green-500">Payment successful. Redirecting to merchant.</div>
        );
      }
      else if (paymentFailed) {
        return (
          <div className="text-red-500">Payment failed. Redirecting to merchant.</div>
        );
      } else {
        return <Button type="submit" className="w-full">Pay ${paymentAmount.toFixed(2)}</Button>
      }
  }

  return (
    <div className="h-dvh flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto my-auto">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">Warning</p>
          <p>This is a demo form. Nothing you enter is stored or processed, but you should still not enter real credit card details here.</p>
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Credit Card Payment
          </CardTitle>
          <CardDescription>Enter your credit card details to complete the payment.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between bg-muted p-4 rounded-md">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                <span className="font-medium">{merchantName}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">{paymentAmount.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="expirationMonth">Expiration Date</Label>
                <div className="flex gap-2">
                  <Select value={expirationMonth} onValueChange={setExpirationMonth} required>
                    <SelectTrigger id="expirationMonth" className="w-full">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                          {month.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={expirationYear} onValueChange={setExpirationYear} required>
                    <SelectTrigger id="expirationYear" className="w-full">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  maxLength={3}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Footer />
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

