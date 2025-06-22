import React from 'react';
import category1 from "../../assets/category-1.jpg";
import category2 from "../../assets/category-2.jpg";
import category3 from "../../assets/category-3.jpg";
import category4 from "../../assets/category-4.jpg";
import { Link } from 'react-router-dom';

const Categories = () => {
    const categories = [
        { name: 'Accessories', path: 'Accessories', image: category1 },
        { name: 'Dress Collection', path: 'Dress', image: category2 },
        { name: 'Footwear', path: 'Footwear', image: category3 },
        { name: 'Cosmetics', path: 'Cosmetics', image: category4 }
    ];

    return (
        <div className='product__grid'>
            {categories.map((category) => (
                <Link 
                    key={category.name}
                    to={`/categories/${category.path}`} 
                    className='categories__card'
                    onClick={() => console.log("Clicked Category:", category.path)}
                >
                    <img src={category.image} alt={category.name} />
                    <h4>{category.name}</h4>
                </Link>
            ))}
        </div>
    );
};

export default Categories;
