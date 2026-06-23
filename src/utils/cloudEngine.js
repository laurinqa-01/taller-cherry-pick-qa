export const syncData = async () => {
  const response = await fetch('https://api.github.com');
  const data = await response.json();
  return data;
};