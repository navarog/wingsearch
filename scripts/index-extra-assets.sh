cd src/assets
(cd cards/birds-robbie && ls) | jq -R '{"robbie": (reduce inputs as $i ({}; . + {($i | sub(".png"; "")): true}))}' > data/extra-assets.json
