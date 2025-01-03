import fs from "fs";
import "dotenv/config";

const contentEndpoint =
  "https://api-eu-central-1.hygraph.com/v2/ckzhgf7f30mi901xs88ok02gc/master";

const baseFolder = "./strapi-export";

const allFiles = fs.readdirSync(baseFolder);

const jsonFiles = allFiles.filter((file) => file.endsWith(".json"));

const sources = ["Recipe"].map((sourceName) => {
  const sourceFile = jsonFiles.find((file) => file.startsWith(sourceName));

  if (!sourceFile) {
    throw new Error(`No source file found for ${sourceName}`);
  }

  return { name: sourceName, file: sourceFile };
});

function getSourceFile(sourceName) {
  const source = sources.find(({ name }) => name === sourceName);

  if (!source) {
    throw new Error(`No source file found for ${sourceName}`);
  }

  return source.file;
}

function readExportFile(fileName) {
  return JSON.parse(
    fs.readFileSync(`${baseFolder}/${fileName}`, "utf-8").toString(),
  );
}

async function upload(url) {
  const data = await fetch(`${contentEndpoint}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HYGRAPH_AUTH_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `url=${encodeURIComponent(url)}`,
  });

  return data.json();
}

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

async function findAssetByFileName(fileName) {
  const { data } = await graphql(
    `
      query GetAsset($fileName: String!) {
        assets(where: { fileName: $fileName }) {
          id
        }
      }
    `,
    { fileName },
  );

  if (data && data.assets.length >= 1) {
    return data.assets[0];
  }

  return null;
}

function updateRecipe(slug, values) {
  return graphql(
    `
      mutation UpdateRecipe($slug: String!, $values: RecipeUpdateInput!) {
        updateRecipe(where: { slug: $slug }, data: $values) {
          id
        }
      }
    `,
    {
      slug,
      values,
    },
  );
}

async function syncImage(image) {
  const fileName = image.split("/").pop();

  let res = await findAssetByFileName(fileName);

  if (!res) {
    res = await upload(image);
  }

  const { id } = res;

  return id;
}

async function sync(recipe) {
  if (!recipe.cover) {
    return;
  }

  const coverId = await syncImage(recipe.cover.url);

  const images = [];

  for (const image of recipe.gallery) {
    const imageId = await syncImage(image.url);

    images.push(imageId);
  }

  const updated = await updateRecipe(recipe.slug, {
    cover: {
      connect: {
        id: coverId,
      },
    },
    gallery: {
      connect: images.map((id) => ({
        where: { id },
      })),
    },
  });

  console.log(updated);
}

async function main() {
  const recipeSourceFile = getSourceFile("Recipe");

  const recipes = readExportFile(recipeSourceFile);

  let i = 0;
  for (const recipe of recipes) {
    console.log(`Syncing ${++i} / ${recipes.length}`);
    await sync(recipe);
  }
}

main();
