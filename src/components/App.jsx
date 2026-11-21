
import React, { useEffect, useState } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [toys, setToys] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // GET: Fetch all toys when the application loads
  useEffect(() => {
    fetch("http://localhost:3001/toys")
      .then((response) => response.json())
      .then((data) => setToys(data))
      .catch((error) => console.error("Error fetching toys:", error));
  }, []);

  function handleClick() {
    setShowForm((previousValue) => !previousValue);
  }

  // POST: Add a new toy
  function handleAddToy(newToy) {
    fetch("http://localhost:3001/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((data) => {
        setToys((previousToys) => [...previousToys, data]);
        setShowForm(false);
      })
      .catch((error) => console.error("Error adding toy:", error));
  }

  // DELETE: Remove a toy
 function handleDeleteToy(id) {
  fetch(`http://localhost:3000/toys/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      setToys((previousToys) =>
        previousToys.filter((toy) => toy.id !== id)
      );
    })
    .catch((error) => console.error(error));
}

  // PATCH: Increase the likes of a toy
  function handleLikeToy(toy) {
    const updatedLikes = toy.likes + 1;

    // Update the DOM immediately
    setToys((previousToys) =>
      previousToys.map((currentToy) =>
        currentToy.id === toy.id
          ? { ...currentToy, likes: updatedLikes }
          : currentToy
      )
    );

    fetch(`http://localhost:3001/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likes: updatedLikes,
      }),
    }).catch((error) => console.error("Error updating likes:", error));
  }

  return (
    <>
      <Header />

      {showForm && <ToyForm onAddToy={handleAddToy} />}

      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>

      <ToyContainer
        toys={toys}
        onDeleteToy={handleDeleteToy}
        onLikeToy={handleLikeToy}
      />
    </>
  );
}

export default App;
