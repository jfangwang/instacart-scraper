import 'dotenv/config';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function getFoodList() {
  const listDB = await notion.databases.query({
    database_id: process.env.NOTION_PAGE_ID,
    filter: {
      or: [
        {
          property: 'Aldi URL',
          rich_text: {
            is_not_empty: true,
          },
        },
        {
          property: 'Shoprite URL',
          rich_text: {
            is_not_empty: true,
          },
        },
        {
          property: 'Costco URL',
          rich_text: {
            is_not_empty: true,
          },
        },
        {
          property: 'Big Y URL',
          rich_text: {
            is_not_empty: true,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Updated',
        direction: 'ascending',
      },
    ],
  });
  return listDB;
}

export default getFoodList;
