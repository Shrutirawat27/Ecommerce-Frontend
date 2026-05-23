const ProductSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-md shadow-sm overflow-hidden animate-pulse"
        >
          
          <div className="w-full aspect-[3/4] bg-gray-200"></div>

          <div className="p-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>

            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>

            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-gray-200 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;