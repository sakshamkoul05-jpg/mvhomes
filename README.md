# MV Homes

Static website for MV Homes (MV Properties, Regd.), Malviya Nagar, New Delhi.

No build step. Open `index.html` in a browser, or host the folder on any static host (GitHub Pages, Netlify, Hostinger).

## Updating listings

Listings live in the `LISTINGS` array near the top of the `<script>` in `index.html`. Each entry looks like:

```js
{id:1, p:"sale", loc:"Malviya Nagar", title:"Park-facing 3 BHK builder floor",
 bhk:3, plot:"200 sq. yd.", floor:"Second", facing:"East", price:"₹2.65 Cr", extra:"Lift · stilt parking"}
```

- `p` is `"sale"` or `"rent"`. Rentals also take `per:"/month"`.
- `floor` must be one of `Ground`, `First`, `Second`, `Third` so the floor filter works.
- To show a photo instead of the floor-plan drawing, add `photo:"images/listing-1.jpg"` and put the image in an `images/` folder.

## Enquiries

The enquiry form opens WhatsApp to +91 99113 54620 with the details pre-filled. To change the number, search `919911354620` in `index.html`.
