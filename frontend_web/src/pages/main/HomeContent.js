import React, { useEffect, useState } from "react";
import ShowCaseCard from "../../components/ShowCaseCard";
import CRUD from "../../_services/CRUD";

function HomeContent(props) {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    CRUD.list("/shop/categories", null, {
      onSuccess: (res) =>
        setCategories(
          res.map((cat) => {
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
        ),
      onFail: (err) => console.log(err),
    });
  }, []);

  return (
    <>
      <div className="slideshow">
        <img src="/static/images/grocery-cart-with-item.jpg" alt="" srcset="" />
      </div>
      {categories.map((cat) => (
        <ShowCaseCard category={cat.name} items={cat.items} />
      ))}
    </>
  );
}

export default HomeContent;
