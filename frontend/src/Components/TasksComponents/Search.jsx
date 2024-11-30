import React from "react";

const Search = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="mt-4 px-4">
      <input
        type="text"
        placeholder="Search by title..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>
  );
};

export default Search;
