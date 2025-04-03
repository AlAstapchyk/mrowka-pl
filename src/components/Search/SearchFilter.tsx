import React from "react";
import JobOfferItem from "../JobOfferItem";

const SearchFilter = () => {
  return (
    <div className="flex w-[12rem] flex-col rounded-lg border border-gray-700 p-4">
      <p className="flex text-xl font-bold">Job level</p>
      <div className="flex flex-col">
        <label>
          <input type="checkbox" name="role" value="trainee" /> Trainee/Intern
        </label>
        <label>
          <input type="checkbox" name="role" value="assistant" /> Assistant
        </label>
        <label>
          <input type="checkbox" name="role" value="junior" /> Junior
        </label>
        <label>
          <input type="checkbox" name="role" value="middle" /> Middle
        </label>
        <label>
          <input type="checkbox" name="role" value="senior" /> Senior
        </label>
        <label>
          <input type="checkbox" name="role" value="expert" /> Expert
        </label>
        <label>
          <input type="checkbox" name="role" value="coordinator" /> Coordinator
        </label>
        <label>
          <input type="checkbox" name="role" value="manager" /> Manager
        </label>
        <label>
          <input type="checkbox" name="role" value="director" /> Director
        </label>
        <label>
          <input type="checkbox" name="role" value="president" /> President
        </label>
        <label>
          <input type="checkbox" name="role" value="handworker" /> Handworker
        </label>
      </div>

      <p className="flex pt-2 text-xl font-bold">Salary</p>
      <div className="flex">
        From <input className="mx-2 w-18 min-w-4" type="number"></input>
        zł
      </div>

      <p className="flex pt-2 text-xl font-bold">Working mode</p>
      <div className="flex flex-col">
        <label>
          <input type="checkbox" name="role" value="stationary" /> Stationary
          work
        </label>
        <label>
          <input type="checkbox" name="role" value="hybrid" /> Hybrid work
        </label>
        <label>
          <input type="checkbox" name="role" value="remote" /> Remote work
        </label>
      </div>

      <p className="flex pt-2 text-xl font-bold">Type of contract</p>
      <div className="flex flex-col">
        <label>
          <input type="checkbox" name="role" value="stationary" /> Employment
          contract
        </label>
        <label>
          <input type="checkbox" name="role" value="hybrid" /> Contract for work
        </label>
        <label>
          <input type="checkbox" name="role" value="remote" /> Contract of
          mandate
        </label>
        <label>
          <input type="checkbox" name="role" value="stationary" /> Contract B2B
        </label>
        <label>
          <input type="checkbox" name="role" value="hybrid" /> Replacement
          contract
        </label>
        <label>
          <input type="checkbox" name="role" value="remote" /> Agency agreement
        </label>
        <label>
          <input type="checkbox" name="role" value="stationary" /> Internship
          contract
        </label>
      </div>
    </div>
  );
};

export default SearchFilter;
