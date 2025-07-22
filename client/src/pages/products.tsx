import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ShoppingCart, Star, Heart, Package, Truck, Shield, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/Footer";
import type { Product } from "@shared/schema";
import logoPath from "@assets/Logo png_1752749850863.png";

interface CartItem {
  productId: number;
  quantity: number;
  product: Product;
}

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

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

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "Order Created",
        description: "Your order has been placed successfully!",
      });
      setCart([]);
      setIsCartOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
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

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.productId === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId: product.id, quantity: 1, product }];
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    ));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.product.price) * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      shippingAddress: {
        street: "123 Main St",
        city: "Phnom Penh",
        country: "Cambodia",
        postalCode: "12345",
      },
      billingAddress: {
        street: "123 Main St",
        city: "Phnom Penh",
        country: "Cambodia",
        postalCode: "12345",
      },
    };

    createOrderMutation.mutate(orderData);
  };

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img src={logoPath} alt="Santepheap Logo" className="w-8 h-8" />
              <span className="text-2xl font-bold text-dark-gray">Santepheap</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" className="text-medium-gray hover:text-medical-blue">
                  Back to Home
                </Button>
              </Link>
              {isAuthenticated ? (
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = "/api/logout"}
                  className="text-medium-gray hover:text-medical-blue"
                >
                  Sign Out
                </Button>
              ) : (
                <Button 
                  onClick={() => window.location.href = "/api/login"}
                  className="bg-medical-blue hover:bg-medical-blue-dark"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dark-gray">Dental Products Store</h1>
              <p className="text-medium-gray mt-2">Professional-grade dental products recommended by our dentists</p>
            </div>
            <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Cart ({getCartItemCount()})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Shopping Cart</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-medium-gray py-8">Your cart is empty</p>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <img 
                              src={item.product.images?.[0] || "/api/placeholder/80/80"} 
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <h4 className="font-medium">{item.product.name}</h4>
                              <p className="text-sm text-medium-gray">${item.product.price}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              +
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeFromCart(item.productId)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-semibold">Total: ${getCartTotal().toFixed(2)}</span>
                        </div>
                        <Button 
                          onClick={handleCheckout}
                          className="w-full bg-medical-blue hover:bg-medical-blue-dark"
                          disabled={createOrderMutation.isPending}
                        >
                          {createOrderMutation.isPending ? "Processing..." : "Checkout"}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-8 text-sm text-medium-gray">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Dentist recommended products</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Secure payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    onClick={() => addToCart(product)}
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
      </div>
      
      <Footer />
    </div>
  );
}