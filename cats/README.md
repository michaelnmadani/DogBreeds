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
| Shedding | **Hair & allergies** | Some breeds shed less or are *reported* to produce less Fel d 1 allergen (see below) |
| — | How **chatty** | Vocalness varies a lot between breeds (Siamese vs. Persian) |
| Temperament | Lap cat / devoted shadow / independent / playful | These are the personality types cat owners usually describe |

**Breeds.** 50 breeds, including 17 allergy-friendlier ones. They cover the CFA's most popular breeds and a spread of energy, size, coat and temperament profiles.

**"Good to know" notes.** Every result card includes an honest caveat on health, care or legality, for example:
- Flat-faced breeds (Persian, Exotic, Himalayan): breathing and eye problems.
- Korat: fatal inherited gangliosidosis, which DNA testing prevents.
- Bengal and Savannah: legal restrictions in some US states and cities.
- Hairless breeds (Sphynx, Donskoy, Peterbald): new hairless cats can't be bred, sold or acquired in the Netherlands since 2026, and Germany treats breeding whiskerless cats as "torture breeding".
- "Lower-allergen" breeds: individual cats vary, and no cat is allergen-free.

**Adoption callout.** The results page encourages people to consider shelter cats as well.

**Deliberately excluded.** Breeds whose defining trait comes from a mutation linked to painful disease:
- **Scottish Fold:** the fold-ear gene causes osteochondrodysplasia (painful cartilage and bone disease) in every Fold.
- **Munchkin and Munchkin crosses such as the Bambino:** dwarfism. The RSPCA lists the Munchkin and Scottish Fold among breeds with significant welfare problems.
- **Manx and Cymric:** the tailless gene causes Manx syndrome (spina bifida, incontinence, hind-leg weakness).

The Japanese Bobtail is included because its recessive tail gene is different from the Manx gene and isn't linked to spinal problems.

## Allergies

Choosing **"Allergies in the home"** makes the quiz show **only** allergy-friendlier breeds, rather than just nudging their scores. Any other answer can still lift an allergy-unfriendly breed into the top 5, which isn't acceptable for someone with allergies.

Each breed's `traits.coat.allergy` weight means:

| Weight | Meaning | Breeds |
|---|---|---|
| 3 | Strongest reputation for producing **less Fel d 1** | Siberian, Balinese, Javanese |
| 2 | Often recommended: low-shedding, hairless or Siamese-type coats | Russian Blue, Korat, Burmese, Siamese, Oriental Shorthair, Colorpoint Shorthair, Devon Rex, Cornish Rex, LaPerm, Sphynx, Donskoy, Peterbald, Ocicat, Bengal |
| 0–1 | Everything else. Low shedding alone (e.g. Tonkinese) doesn't count | — |

Breeds weighted 2 or more (`ALLERGY_FRIENDLY_MIN` in `app.js`) get an "Allergy-friendlier" badge on every result card. When allergies are selected, the results page also shows an advisory. The evidence behind it:
- **Fel d 1 source:** it comes from saliva and skin glands, not fur, and levels vary widely between individual cats of the same breed. For example, only some Siberians carry the gene variants linked to lower levels.
- **Sex and neutering:** intact males produce more Fel d 1 than neutered males and females.
- **Diet:** in a 105-cat study, food containing an anti-Fel d 1 egg antibody cut active Fel d 1 on hair by 47% on average.
- **Household measures:** allergists recommend keeping the cat out of the bedroom, HEPA filtration, washing bedding weekly, and having someone else clean the litter box.

## Photos

Each card tries these sources in order:
1. **[TheCatAPI](https://thecatapi.com)** `images/search?breed_ids=…`. The photo is used only if the response is tagged with the requested breed, because without an API key the breed filter may be ignored and return a random cat. Breeds TheCatAPI doesn't list (Peterbald) have `catApiId: null` and skip this step.
2. **Wikipedia**: the lead image of the breed's article (REST `page/summary` endpoint).
3. A 🐱 placeholder.

To get more varied photos, set `CAT_API_KEY` in `app.js` to a free TheCatAPI key. It is sent as the `x-api-key` header. Note that it is visible to anyone who views the page source.

## Data model

Each breed in `BREEDS` (in `app.js`) has:
- `traits`: 0–3 weights for every answer to every question.
- `reasons`: short explanations keyed `questionId_answer`, shown when that answer was chosen. Every allergy-friendlier breed has a `coat_allergy` reason.
- `tags`, `note`, `catApiId` (or `null`), `wikiTitle`.

An answer option can set `minWeight`, which rules out any breed scoring below it for that answer. The allergy option uses this.

To add a breed, copy an existing entry. Every question id and answer value must appear in `traits`.

## Research sources

Breed traits were compiled from breed-registry profiles, veterinary and welfare sources, and allergy research:

**Breeds**
- [CFA most popular breeds](https://cfa.org/cat-talk/most-popular-breeds-for-2026/)
- Breed profiles:
  - Hill's: [Devon Rex](https://www.hillspet.com/cat-care/cat-breeds/devon-rex), [Havana Brown](https://www.hillspet.com/cat-care/cat-breeds/havana-brown)
  - Royal Canin: [Norwegian Forest Cat](https://www.royalcanin.com/us/cats/breeds/norwegian-forest-cat), [Australian Mist](https://www.royalcanin.com/us/cats/breeds/australian-mist)
  - PetMD: [Korat](https://www.petmd.com/cat/breeds/korat), [Ocicat](https://www.petmd.com/cat/breeds/ocicat), [Selkirk Rex](https://www.petmd.com/cat/breeds/selkirk-rex)
  - CFA: [Egyptian Mau](https://cfa.org/breed/egyptian-mau/)

**Allergies**
- [PetMD on "hypoallergenic" breeds](https://www.petmd.com/cat/general-health/hypoallergenic-cat-breeds)
- [Sex difference in Fel d 1 production (J Allergy Clin Immunol, 1996)](https://pubmed.ncbi.nlm.nih.gov/8765830/)
- [Anti-Fel d 1 IgY diet study (Satyaraj et al., 2019)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6485700/)
- [Fel d 1 gene variants in Siberian cats](https://pmc.ncbi.nlm.nih.gov/articles/PMC5753643/)
- [Mayo Clinic: allergy-proof your home](https://www.mayoclinic.org/diseases-conditions/allergies/in-depth/allergy/art-20049365)

**Health and welfare**
- [International Cat Care on Scottish Fold osteochondrodysplasia](https://icatcare.org/articles/scottish-fold-osteochondrodysplasia)
- [RSPCA on exaggerated features](https://kb.rspca.org.au/categories/companion-animals/cats/health-issues/what-are-the-health-and-welfare-issues-associated-with-exaggerated-physical-features-in-cats)
- [PetMD on Manx syndrome](https://www.petmd.com/cat/conditions/genetic/manx-syndrome-cats)
- [Japanese Bobtail vertebral study (Pollard et al., 2015)](https://pubmed.ncbi.nlm.nih.gov/25488973/)
- [UC Davis: Korat GM1](https://vgl.ucdavis.edu/test/korat-gm1) and [GM2](https://vgl.ucdavis.edu/test/korat-gm2) gangliosidosis tests

**Laws**
- US state-law summaries for [Savannah](https://www.catster.com/lifestyle/are-savannah-cats-legal-in-the-united-states/) and [Bengal](https://www.catster.com/lifestyle/are-bengal-cats-illegal-in-some-states/) ownership
- [Dutch ban on Sphynx and Scottish Fold ownership](https://www.dutchnews.nl/2025/10/dutch-ban-new-ownership-of-sphynx-and-scottish-fold-cats/)
- [German court ruling on whiskerless Sphynx breeding](https://www.thelocal.de/20150924/willi-the-naked-cat-must-be-castrated-court-rules)

The trait scores are a matching aid, not a guarantee. Individual cats vary, so meet the cat, and for allergies spend time with the specific cat, before committing.
