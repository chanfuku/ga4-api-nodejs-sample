import fs from 'fs/promises';
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

// サービスアカウントキーのパス
const CREDENTIALS_PATH = 'google-service-account-secret.json';
// アクセスしたいスプレッドシートのID
const SPREADSHEET_ID = process.env.SPREADSHEET_ID; // ここにスプレッドシートIDを入力
// 読み取りたい範囲
const RANGE = 'シート1!A1:D10'; // ここに読み取りたい範囲を入力

async function accessSpreadsheet() {
  // サービスアカウントキーを読み込み
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
  const credentials = JSON.parse(content);

  // JWTクライアントを作成
  const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  // Google Sheets APIクライアントを作成
  const sheets = google.sheets({ version: 'v4', auth });

  // スプレッドシートのデータを取得
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
  });

  const rows = res.data.values;
  if (rows.length === 0) {
    console.log('No data found.');
  } else {
    console.log('Data:');
    rows.forEach((row) => {
      console.log(row);
    });
  }
}

async function writeData() {
  // サービスアカウントキーを読み込み
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
  const credentials = JSON.parse(content);

  // JWTクライアントを作成
  const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  // Google Sheets APIクライアントを作成
  const sheets = google.sheets({ version: 'v4', auth });

  // 書き込みデータ
  const values = [
    ['Name', 'Age', 'Gender', 'Country'], // ここに書き込みたいデータを入力
  ];

  // リクエストのペイロードを作成
  const resource = {
    values,
  };

  // スプレッドシートにデータを書き込む
  const result = await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
    valueInputOption: 'RAW', // データの入力方式を指定。RAWまたはUSER_ENTEREDが使用可能
    resource,
  });

  console.log(`Cells updated: ${result.data.updatedCells}`);
}

await writeData().catch(console.error);
await accessSpreadsheet().catch(console.error);
