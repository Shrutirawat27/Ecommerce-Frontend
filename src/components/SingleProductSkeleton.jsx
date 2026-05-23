const SingleProductSkeleton = () => {
  return (
    <section className="section__container mt-8 animate-pulse">
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        
        {/* Image */}
        <div className="md:w-1/2 w-full">
          <div className="w-full h-[500px] bg-gray-200 rounded-md"></div>
        </div>

        {/* Content */}
        <div className="md:w-1/2 w-full space-y-4">

          <div className="h-8 bg-gray-200 rounded w-3/4"></div>

          <div className="h-6 bg-gray-200 rounded w-1/3"></div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>

          <div className="space-y-2 pt-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>

          <div className="h-12 bg-gray-300 rounded w-40 mt-6"></div>
        </div>
      </div>
    </section>
  );
};

export default SingleProductSkeleton;