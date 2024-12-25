// WorkerList.js
import React from "react";

function WorkerList({ workers }) {
  return (
    <section>
      <h3>Current Workers</h3>
      {workers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
              <tr key={worker._id}>
                <td>{worker.name}</td>
                <td>{worker.email}</td>
                <td>{worker.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No workers available.</p>
      )}
    </section>
  );
}

export default WorkerList;
