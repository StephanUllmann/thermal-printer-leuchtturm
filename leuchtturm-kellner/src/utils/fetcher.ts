//  @ts-ignore
export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const createDish = async (formData: FormData) => {
  const res = await fetch('http://localhost:3000/dishes', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return data;
};

export const createCategory = async (newCategory: string) => {
  const res = await fetch(`http://localhost:3000/dishes/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newCategory }),
  });
  if (!res.ok) throw new Error('Error creating new category', { cause: res });
  const data = await res.json();
  return data;
};
