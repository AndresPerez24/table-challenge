import { React, useState } from "react";
import { useQuery } from "react-query";
import { getData } from "../../api";
import orderBy from "lodash/orderBy";
import Fuse from "fuse.js";

const Table = () => {
  const { data: users, isLoading, isError } = useQuery("data", getData);
  const [filteredUsers, setFilteredUsers] = useState("");
  const [sortingValues, setSortingValues] = useState();
  const [sortingOrder, setSortingOrder] = useState(" ");

  const headings = [
    { label: "Name", value: "name" },
    { label: "Email", value: "email" },
    { label: "Age", value: "age" },
    { label: "Years of Experience", value: "year_of_experience" },
    { label: "Position applied", value: "position_applied" },
    { label: "Applied", value: "application_date" },
    { label: "Status", value: "status" },
  ];

  if (isLoading) {
    return <div>Is Loading</div>;
  }

  if (isError) {
    return <div>ERROR</div>;
  }

  const fuse = new Fuse(users, {
    includeScore: true,
    keys: [
      {
        name: "name",
        weight: 0.15,
      },
      {
        name: "status",
        weight: 0.7,
      },
      {
        name: "position_applied",
      },
    ],
  });

  function handleOnSeach({ currentTarget = {} }) {
    const { value } = currentTarget;
    setFilteredUsers(value);
  }

  const results = fuse.search(filteredUsers);
  const userResults = results.map((result) => result.item);

  const usersToSort = () => {
    const usersToMap = filteredUsers === "" ? users : userResults;

    return usersToMap.map((user) => {
      const today = new Date();
      const birthDate = new Date(user.birth_date);
      const age = today.getFullYear() - birthDate.getFullYear();
      return { ...user, age };
    });
  };

  const orderedUsers = orderBy(usersToSort(), sortingValues, [sortingOrder]);

  const onClickHeading = (value) => {
    if (value !== sortingValues) {
      setSortingOrder("asc");
      return setSortingValues(value);
    }

    sortingOrder === "asc" ? setSortingOrder("desc") : setSortingOrder("asc");

    setSortingValues(value);
  };

  return (
    <div>
      <input type="text" value={filteredUsers} onChange={handleOnSeach} />
      <table>
        <thead>
          <tr>
            {headings.map(({ label, value }) => (
              <th key={value}>
                <button onClick={() => onClickHeading(value)}>{label}</button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orderedUsers.map(
            ({
              id,
              name,
              email,
              age,
              year_of_experience,
              application_date,
              status,
              position_applied,
            }) => (
              <tr key={id}>
                <th>{name}</th>
                <th>{email}</th>
                <th>{age}</th>
                <th>{year_of_experience}</th>
                <th>{position_applied}</th>
                <th>{application_date}</th>
                <th>{status}</th>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
