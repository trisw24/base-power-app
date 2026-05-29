exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const SLACK_TOKEN = process.env.SLACK_TOKEN;
  
  if (!SLACK_TOKEN) {
    console.error("SLACK_TOKEN is not set");
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: "SLACK_TOKEN not configured" }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch(e) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Invalid JSON" }) };
  }

  const { endpoint, payload } = body;
  console.log("Calling Slack endpoint:", endpoint);
  console.log("Payload:", JSON.stringify(payload));

  const res = await fetch(`https://slack.com/api/${endpoint}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SLACK_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  console.log("Slack response:", JSON.stringify(data));
  
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  };
};
