const ctfDefault = {
  weight: 0,
  format: "any",
  restrictions: "any",
  id: "any",
};

const ctfAPI = async (date, limit) => {
  const apiURL = "https://ctftime.org/api/v1/events/";

  const params = new URLSearchParams({
    start: date,
    limit: limit,
  });

  const apiWithParams = `${apiURL}?${params.toString()}`;
  const response = await fetch(apiWithParams, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!response.ok) {
    throw new Error(`Failure. Status code: ${response.status}`);
  }
  const data = await response.json();

  return data;
};

module.exports = {
  ctfDefault,
  ctfAPI,
};
