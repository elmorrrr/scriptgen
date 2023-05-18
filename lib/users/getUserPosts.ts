export default async function getUserPosts(user_id: string) {
  const URL = `https://jsonplaceholder.typicode.com/posts?userId=${user_id}`;
  const res = await fetch(URL);

  if (!res.ok) throw new Error("Failed to fetch user posts data");
  return res.json();
}
