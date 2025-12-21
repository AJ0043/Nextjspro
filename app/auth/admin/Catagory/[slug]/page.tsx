import { notFound } from "next/navigation";

interface Category {
  _id: string;
  title: string;
  slug: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  image?: string;
}

async function getCategory(slug: string): Promise<Category | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/category`, {
    cache: "no-store",
  });
  const data = await res.json();

  return data.categories.find((cat: Category) => cat.slug === slug) || null;
}

async function getProducts(slug: string): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?category=${slug}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.products || [];
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await getCategory(params.slug);

  if (!category) return notFound();

  const products = await getProducts(category.slug);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">
        {category.title}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-4 hover:shadow-lg transition"
            >
              <img
                src={product.image || "/placeholder.png"}
                alt={product.title}
                className="h-40 w-full object-cover mb-3"
              />
              <h2 className="font-semibold">{product.title}</h2>
              <p className="text-purple-600 font-bold">₹{product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
