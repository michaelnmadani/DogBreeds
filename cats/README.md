# Cat Breed Finder

A cat version of the Dog Breed Finder, forked into this folder. It uses the same quiz flow and scoring engine: 12 questions, a weighted 0–3 score per breed per answer, and the top 5 shown with reasons. The questions and breed data are rewritten for cats.

Open `cats/index.html` in a browser. There is no build step. The header links back to the dog version at the repo root.

## What changed from the dog version

**Questions.** Dog-specific questions were replaced with ones that matter for cats:

| Dog version | Cat version | Why |
|---|---|---|
| Daily exercise (walks) | Daily **playtime** | Cats are exercised through interactive play, not walks |
| Living space / yard | Home size + **catio** | Vets and welfare groups recommend keeping cats indoors or in enclosed outdoor space |
| Strangers / protectiveness | How **lively the household** is | Cats vary in how they cope with noise, guests and change, not in guarding |
| Climate | Removed | Mostly indoor animals |
| Shedding | **Hair & allergies** | Some breeds are *reported* to produce less Fel d 1 allergen |
| — | How **chatty** | Vocalness varies a lot between breeds (Siamese vs. Persian) |
| Temperament | Lap cat / devoted shadow / independent / playful | These are the personality types cat owners usually describe |

**Breeds.** 27 breeds, covering the CFA's most popular breeds and a spread of energy, size, coat and temperament profiles.

**"Good to know" notes.** Every result card includes an honest caveat on health, care or legality, for example:
- Flat-faced breeds (Persian, Exotic): breathing and eye problems.
- Sphynx: needs regular baths and warmth.
- Bengal and Savannah: legal restrictions in some US states and cities.
- "Lower-allergen" breeds: individual cats vary, and no cat is allergen-free.

**Adoption callout.** The results page encourages people to consider shelter cats as well.

**Deliberately excluded.** Scottish Fold and Munchkin are left out. The fold-ear gene causes osteochondrodysplasia (painful cartilage and bone disease) in every Scottish Fold. The RSPCA lists both breeds among those with significant welfare problems.

## Photos

Each card tries these sources in order:
1. **[TheCatAPI](https://thecatapi.com)** `images/search?breed_ids=…`. The photo is used only if the response is tagged with the requested breed. Without an API key the breed filter may be ignored, which would return a random cat.
2. **Wikipedia**: the lead image of the breed's article (REST `page/summary` endpoint).
3. A 🐱 placeholder.

To get more varied photos, set `CAT_API_KEY` in `app.js` to a free TheCatAPI key. It is sent as the `x-api-key` header. Note that it is visible to anyone who views the page source.

## Data model

Each breed in `BREEDS` (in `app.js`) has:
- `traits`: 0–3 weights for every answer to every question.
- `reasons`: short explanations keyed `questionId_answer`, shown when that answer was chosen.
- `tags`, `note`, `catApiId`, `wikiTitle`.

To add a breed, copy an existing entry. Every question id and answer value must appear in `traits`.

## Research sources

Breed traits were compiled from breed-registry profiles and veterinary and welfare sources, including:
- [CFA most popular breeds](https://cfa.org/cat-talk/most-popular-breeds-for-2026/)
- [International Cat Care on Scottish Fold osteochondrodysplasia](https://icatcare.org/articles/scottish-fold-osteochondrodysplasia)
- [RSPCA on exaggerated features](https://kb.rspca.org.au/categories/companion-animals/cats/health-issues/what-are-the-health-and-welfare-issues-associated-with-exaggerated-physical-features-in-cats)
- [PetMD on "hypoallergenic" breeds](https://www.petmd.com/cat/general-health/hypoallergenic-cat-breeds)
- [Hill's](https://www.hillspet.com/cat-care/cat-breeds/devon-rex) and [Royal Canin](https://www.royalcanin.com/us/cats/breeds/norwegian-forest-cat) breed profiles
- State-law summaries for [Savannah](https://www.catster.com/lifestyle/are-savannah-cats-legal-in-the-united-states/) and [Bengal](https://www.catster.com/lifestyle/are-bengal-cats-illegal-in-some-states/) ownership

The trait scores are a matching aid, not a guarantee. Individual cats vary, so meet the cat, and for allergies spend time with the specific cat, before committing.
