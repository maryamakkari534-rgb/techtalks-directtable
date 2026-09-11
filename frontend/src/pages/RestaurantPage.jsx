import React, { useEffect, useState } from "react";

function RestaurantPage() {

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/restaurants")
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => console.log(err));
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
          </div>
        ))
      )}

    </div>
  );
}

export default RestaurantPage;