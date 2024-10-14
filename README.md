# Dummy Payment Processor

A dummy payment processor to mock payment workflows in your apps

## Deploy to Vercel

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/matt-goldman/DummyPaymentProcessor)

## How to use

You can request a token from the `/token` endpoint which will return an object with a payment token:

```json
{
    "token": "07ebdb34-d762-42ba-8c88-a3bfb658b11f"
}
```

You can post a token and an amount to the `/process` endpoint:

```json
{
    "token": "07ebdb34-d762-42ba-8c88-a3bfb658b11f",
    "amount": 435.32
}
```

By default the payment will fail if the amount exceeds `1000` - you can configure this in your environment file.

The endpoint will return `200` for a successful payment and `400` for a failed payment.

**For a successful payment you _must_ submit a payment retrieved from the token endpoint.**

Optionally, you can also use the UI. Call it at the root page, and pass in a redirect URI, merchant name, and amount as query parameters:

```html
http://localhost:3000/?returnUrl=http://localhost:5001/paymentcallback&merchantName=Amazon&paymentAmount=154.87
```

**Note:** You can (and should) URL encode these values; they are shown here plainly for illustration (although this will also work).

The merchant name and amount will be rendered in the form. The payment will always succeed if the card number is entered as `4242 4242 4242 4242`, and will always fail for any other number. No other values are taken into consideration.
