import React from 'react';

const Home = () => {

  const handleClick = () => {
    window.electronAPI.test();
  }

  return (
    <div>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}

export default Home;
