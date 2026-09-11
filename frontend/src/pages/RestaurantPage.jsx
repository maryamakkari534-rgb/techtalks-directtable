import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RestaurantPage() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch("/restaurants")
      .then((res) => {
        console.log("response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("restaurants data:", data);
        setRestaurants(data);
      })
      .catch((err) => {
        console.error("restaurant fetch error:", err);
      });
  }, []);

  return (
    <div>
      <h1>Restaurants</h1>

      {restaurants.length === 0 ? (
        <p>No restaurants available</p>
      ) : (
        restaurants.map((restaurant) => (
          <div key={restaurant.id}>
            <h2>{restaurant.name}</h2>
            <p>{restaurant.address}</p>

            <Link to={`/restaurant/${restaurant.id}`}>
              View Menu
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default RestaurantPage;
