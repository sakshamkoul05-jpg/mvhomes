# MV Homes website

Static site for MV Homes (MV Properties, Regd.), Malviya Nagar, New Delhi. No build step needed to host: upload this folder as-is (GitHub Pages, Netlify, Vercel, Hostinger).

## Pages
index (Home) · about · buy · rent · sell · localities · process · gallery · guide (Buyer's guide + EMI) · contact

## Editing content
- **Listings, photos, localities:** `assets/data.js`. Each listing has `p` (`sale`/`rent`), `loc`, `bhk`, `plot`, `floor` (`Ground`/`First`/`Second`/`Third`), `price`, and `img`.
- **Photos:** currently free Unsplash photos (https://unsplash.com/license). Replace with the client's real photos: put files in `images/` and set `img:"images/your-photo.jpg"`.
- **Styles:** `assets/style.css`. **Behaviour/animations:** `assets/main.js`.

## Enquiry form → email
Forms send to mvproperties2000@gmail.com through FormSubmit (free, no backend).
The **first** submission triggers an activation email from FormSubmit to that inbox. Click "Activate" once; after that every enquiry arrives by email.
If email fails, the form offers to send the same details on WhatsApp.

## WhatsApp
Number: 919911354620. Search for it in `assets/data.js` / `assets/main.js` to change.
