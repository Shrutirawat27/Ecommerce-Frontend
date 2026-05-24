import { useSelector } from "react-redux";
import ProductCards from "../shop/ProductCards";

const Wishlist = () => {

  const wishlistProducts = useSelector(
    (state) => state.wishlist.products
  );

  return (
    <section className="section__container">

      <h2 className="section__header">
        My Wishlist
      </h2>

      {wishlistProducts.length > 0 ? (

        <ProductCards
          products={wishlistProducts}
        />

      ) : (

        <p className="text-gray-500 mt-8">
          Your wishlist is empty.
        </p>
      )}
    </section>
  );
};

export default Wishlist;