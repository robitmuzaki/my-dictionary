export default async (request) => {
  const url = new URL(request.url);
  const word = url.searchParams.get("word")?.trim();

  if (!word) {
    return Response.json({ message: "Please provide a word." }, { status: 400 });
  }

  try {
    const apiUrl =
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;

    const response = await fetch(apiUrl);
    const body = await response.text();
    console.log("Dictionary API status:", response.status);
    console.log("Dictionary API response:", body);
    return new Response(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch {
    return Response.json(
      { message: "Could not connect to the dictionary service." },
      { status: 502 }
    );
  }
};