import fetch from 'node-fetch'

exports.handler = async function (event, context) {
  const url = process.env.VITE_SERVE // 將此替換為你的 HTTP API 端點

  try {
    const response = await fetch(url)
    const data = await response.json()

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' })
    }
  }
}
