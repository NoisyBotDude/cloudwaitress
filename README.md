This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## TERMS

location ID  - used to uniquely identify a location( goHighlevel Account )

## API endpoints

/api/auth - to authenticate a user using GoHighLevel account
/api/form - to submit the form and set the values in datastore
/api/form/exists - to check if a location id exists in database ( used in authentication and other aspects )

/api/webhook/ghl - listens to goHighLevel webhooks
/api/webhook/cw - listens to cloudwaitress webhooks

## tags

callback - attached to the contacts that requested for call back
textback - attached to the contacts that requested for text back
new_cw_order - attached to the contacts who made a new order in cloudwaitress

## terms

- two different gohighlevel locations cannot use the same number 