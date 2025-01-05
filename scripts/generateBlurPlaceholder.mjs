import "dotenv/config";

const contentEndpoint =
  "https://api-eu-central-1.hygraph.com/v2/ckzhgf7f30mi901xs88ok02gc/master";

async function graphql(query, variables = {}) {
  const res = await fetch(contentEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: process.env.HYGRAPH_AUTH_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  return res.json();
}

function loadAssets(after = null, limit) {
  return graphql(
    `
      query LoadAssets($after: String, $limit: Int) {
        assets(
          first: $limit
          after: $after
          where: {
            documentInStages_some: { stage: PUBLISHED }
            placeholderBlurDataUrl: null
          }
        ) {
          id
          url(
            transformation: {
              document: { output: { format: jpg } }
              image: { resize: { width: 30, height: 30 }, blur: { amount: 5 } }
            }
          )
        }
      }
    `,
    { after, limit },
  );
}

async function imageToDataUrl(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  const buffer = await blob.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const mimeType = blob.type;
  return `data:${mimeType};base64,${base64}`;
}

async function main() {
  let after = null;
  const limit = 100;

  do {
    const { data: assetsData } = await loadAssets(after, limit);

    for (const asset of assetsData.assets) {
      const placeholderBlurDataUrl = await imageToDataUrl(asset.url);

      console.log("Updating asset", asset.id);

      await graphql(
        `
          mutation UpdateAsset($id: ID!, $placeholderBlurDataUrl: String!) {
            updateAsset(
              data: { placeholderBlurDataUrl: $placeholderBlurDataUrl }
              where: { id: $id }
            ) {
              id
            }
          }
        `,
        { id: asset.id, placeholderBlurDataUrl },
      );

      console.log("Publishing asset", asset.id);

      await graphql(
        `
          mutation PublishAsset($id: ID!) {
            publishAsset(where: { id: $id }) {
              id
            }
          }
        `,
        { id: asset.id },
      );
    }

    after =
      assetsData.assets.length === limit
        ? assetsData.assets[assetsData.assets.length - 1].id
        : null;
  } while (after);
}

main();
