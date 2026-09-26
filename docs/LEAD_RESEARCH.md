# Lead research format

This is the input format for `scripts/import-research.mjs`: a JSON array of flat objects. Use `null` for anything you couldn't verify. **Never guess.** A wrong phone number or an invented owner name is worse than a blank.

## Sourcing rules

- **Main phone:** must appear on the official website, and ideally match the Google Business Profile. `phoneSource` says where it came from, e.g. "Official website header; matches Google Business Profile".
- **Decision maker:** only from the company's own site, its Google profile or owner replies to reviews, LinkedIn, the BBB, or a state license record. Put the URL in `dmSource`.
- **Direct line:** only if the company itself publishes it for that person. Never take one from a people-search or data-broker site.
- **Paid ads:** check the Google Ads Transparency Center (`adstransparency.google.com/?region=US&domain=…`) or the Meta Ad Library. Write what you saw in `paidAdsNote`.
- **Franchises and national chains are out.** Set `franchise: true` if you can't tell whether the branch can buy on its own.

## Fields

```jsonc
{
  "company": "", "website": "https://…",
  "vertical": "restoration|hvac|plumbing|roofing|electrical|garage-doors|foundation|windows-doors|septic|tree|pest|pool|remodeling|movers|…",
  "city": "", "region": "TX", "country": "US",          // "CA" for Canada
  "timezone": "America/Chicago",
  "hours": "Mon–Fri 7am–6pm", "hoursSource": "Google Business Profile",
  "phone": "(512) 555-0100", "phoneSource": "", "phoneMatchesGoogle": true,
  "googleRating": 4.8, "googleReviews": 312, "latestReviewAge": "3 days ago", "recentReviews": true,
  "paidAds": true, "paidAdsNote": "",
  "emergency247": true, "residential": true, "freeEstimate": true,
  "onlineBooking": false, "chatOrText": false, "financing": true,
  "multipleServiceAreas": true, "phonePrimaryCta": true,
  "afterHoursGap": true,                 // advertises 24/7 but staffed hours are limited
  "reviewResponseComplaints": false, "reviewComplaintQuote": null,
  "locallyOwned": true, "ownershipNote": "", "franchise": false,
  "employeesEstimate": "~20 (team page lists 18)",
  "employeeBand": "1-2|3-4|5-15|16-50|51-100|101-250|250+|unknown",
  "locations": 1, "existingTools": "", "sophisticatedContactCenter": false,
  "dmName": "", "dmTitle": "", "dmSource": "https://…",
  "directLine": null, "directLineSource": null,
  "opportunity": "One factual sentence, framed as a question, not a claim",
  "hooks": ["2–5 short true observations to use on the call"],
  "sources": [{ "label": "About page", "url": "https://…" }],
  "notes": "anything uncertain"
}
```

Every boolean feeds the score in `src/lib/score.ts`, and `hooks`, `opportunity`, `hours` and `dmName` feed the script.
