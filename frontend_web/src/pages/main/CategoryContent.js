import React, { useState, useEffect } from "react";
import CRUD from "../../_services/CRUD";
import CategoryCard from "../../components/CategoryCard";
import Numbers from "../../_helpers/Numbers";
import ShowCaseCard from "../../components/ShowCaseCard";

function CategoryContent() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  useEffect(() => {
    CRUD.list("/shop/categories", null, {
      onSuccess: (res) =>
        setCategories(
          res
            .map((cat) => {
              return {
                name: cat.name,
                items: cat.products.map((p) => {
                  return {
                    ...p,
                    image: {
                      src: `https://source.unsplash.com/1600x900/?${p.name}`,
                    },
                  };
                }),
              };
            })
            .filter((cat) => cat.items.length > 0)
        ),
      onFail: (err) => console.log(err),
    });
  }, []);

  return category ? (
    <ShowCaseCard category={category.name} items={category.items} />
  ) : (
    <div className="categories-wrap">
      {categories.map((cat) => (
        <CategoryCard
          category={cat}
          items={cat.items}
          setCategory={setCategory}
        />
      ))}
    </div>
  );
}

export default CategoryContent;
