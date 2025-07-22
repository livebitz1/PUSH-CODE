import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ShoppingCart, Star, Heart, Filter, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function ProductCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [cart, setCart] = useState<{[key: number]: number}>({});
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products", selectedCategory, sortBy, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (sortBy) params.append("sort", sortBy);
      if (searchTerm) params.append("search", searchTerm);
      
      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json() as Product[];
    },
  });

  const categories = [
    { value: "all", label: "All Products" },
    { value: "toothbrush", label: "Toothbrushes" },
    { value: "toothpaste", label: "Toothpaste" },
    { value: "mouthwash", label: "Mouthwash" },
    { value: "dental_floss", label: "Dental Floss" },
    { value: "whitening", label: "Whitening Products" },
    { value: "accessories", label: "Accessories" },
  ];

  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
    toast({
      title: "Added to Cart",
      description: "Product has been added to your cart",
    });
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-dark-gray mb-4">Dental Products Store</h3>
          <p className="text-medium-gray text-lg">Professional-grade dental products recommended by our dentists</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-medium-gray" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Cart ({getCartItemCount()})
          </Button>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-8 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow group">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img 
                      src={product.images?.[0] || "/api/placeholder/250/200"} 
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {product.isRecommended && (
                      <Badge className="absolute top-2 left-2 bg-medical-blue text-white">
                        Doctor Recommended
                      </Badge>
                    )}
                    {product.originalPrice && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                        Sale
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-semibold text-dark-gray mb-1">{product.name}</h4>
                    <p className="text-sm text-medium-gray line-clamp-2">{product.description}</p>
                    {product.brand && (
                      <p className="text-xs text-medical-blue mt-1">by {product.brand}</p>
                    )}
                  </div>

                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-medium-gray">(4.5)</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-dark-gray">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-medium-gray line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {product.stockQuantity} in stock
                    </Badge>
                  </div>

                  <Button 
                    onClick={() => addToCart(product.id)}
                    className="w-full bg-medical-blue hover:bg-medical-blue-dark"
                    disabled={product.stockQuantity === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-medium-gray mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-dark-gray mb-2">No products found</h4>
            <p className="text-medium-gray">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Featured Categories */}
        <div className="mt-16">
          <h4 className="text-2xl font-bold text-dark-gray mb-8 text-center">Shop by Category</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(1).map((category) => (
              <Button
                key={category.value}
                variant="outline"
                onClick={() => setSelectedCategory(category.value)}
                className="h-20 flex-col gap-2 hover:bg-medical-blue hover:text-white"
              >
                <Package className="h-6 w-6" />
                <span className="text-xs">{category.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}