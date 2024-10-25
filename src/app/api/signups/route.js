import { cookies } from "next/headers";

const API_SECRET = process.env.GOOGLE_ANALYTICS_API_SECRET;
const MEASUREMENT_ID = process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID;

const GOOGLE_ANALYTICS_HOSTNAME = "www.google-analytics.com";

const URL = `https://${GOOGLE_ANALYTICS_HOSTNAME}/mp/collect?api_secret=${API_SECRET}&measurement_id=${MEASUREMENT_ID}`;

if (!API_SECRET) {
  throw new Error("API_SECRET is required");
}

if (!MEASUREMENT_ID) {
  throw new Error("MEASUREMENT_ID is required");
}

// You can extract the session manually if you want to.
// I can't see a reason why you'd want to as the client value is in the format client_id.session_id
const extractSession = (store) => {
  const id = MEASUREMENT_ID.split("-")[1];
  const cookie = store.get(`_ga_${id}`);

  if (!cookie) return null;

  return parseInt(cookie.value.split(".")[2]);
};

const extractUser = (store) => {
  const cookie = store.get("_ga");

  if (!cookie) return null;

  return cookie.value.split(".").slice(2).join(".");
};

const track = async (data = {}) => {
  try {
    console.log(JSON.stringify(data, null, 2));

    const response = await fetch(URL, {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      console.log("Failed to submit the event to Google", response);
    }
  } catch (error) {
    console.log("Failed to send the request to Google", error);
  }
};

export async function POST(request) {
  const store = await cookies();

  const session = extractSession(store);
  const user = extractUser(store);

  if (session && user) {
    track({
      client_id: user,
      non_personalized_ads: false,
      events: [
        {
          name: "sign_up",
          params: {
            session_id: session,
            debug_mode: 1,
          },
        },
      ],
    });
  } else {
    console.log("No session or user found", { session, user });
  }

  return new Response("Successful", { status: 200 });
}
