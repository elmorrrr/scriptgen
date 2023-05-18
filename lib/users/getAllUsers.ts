export default async function getAllUsers() {
  const URL = "https://jsonplaceholder.typicode.com/users";
  const res = await fetch(URL);

  if (!res.ok) throw new Error("Failed to fetch users data");
  return res.json();
}
