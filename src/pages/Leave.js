import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Base from "../components/Base";
import "../styles/dashboard.css";
import "../styles/leaveApplication.css";

import { Toaster, toast } from "sonner";

import axios from "axios";

const Leave = () => {
  const [showTable, setShowTable] = useState(true);
  const [leaveData, setLeaveData] = useState([]);

  const token = localStorage.getItem("token");
  const employeeName = localStorage.getItem("employeeName");

  useEffect(() => {
    if (employeeName) {
      document.title = `Leave | ${employeeName}`;
    } else {
      document.title = "Leave | ESS";
    }

    fetchLeaveDetails();
  }, []);

  const fetchLeaveDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/auth/user/leaves/getAllLeave",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id: localStorage.getItem("employeeId"),
          },
        }
      );

      const { success, data, message } = response.data;

      if (success) {
        setLeaveData(data);
      } else {
        toast.error(message || "Couldn't load leave data");
      }
    } catch (error) {
      toast.error("Error loading leave details: " + error.message);
    }
  };

  const toggleShowTable = () => {
    setShowTable(!showTable);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Number of items to display per page

  // Pagination configuration
  const pageCount = Math.ceil(leaveData.length / itemsPerPage);

  // Function to handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Slice the data based on current page and items per page
  const displayedData = leaveData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <>
      <Base page="leaves" />
      <div id="content">
        <main>
          {showTable && (
            <div className="table-data">
              <div className="order">
                <div className="head">
                  <h3>Your Leave Applications</h3>
                  <button className="table-button" onClick={toggleShowTable}>
                    Apply For Leave
                  </button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Applied On</th>
                      <th>Reason</th>
                      <th>Absence From</th>
                      <th>Absence To</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveData.map((leave) => (
                      <tr key={leave.id}>
                        <td>{`${("0" + leave.appliedOn[2]).slice(-2)}/${(
                          "0" + leave.appliedOn[1]
                        ).slice(-2)}/${leave.appliedOn[0]}`}</td>
                        <td>{leave.reason}</td>
                        <td>{`${("0" + leave.from[2]).slice(-2)}/${(
                          "0" + leave.from[1]
                        ).slice(-2)}/${leave.from[0]}`}</td>
                        <td>{`${("0" + leave.to[2]).slice(-2)}/${(
                          "0" + leave.to[1]
                        ).slice(-2)}/${leave.to[0]}`}</td>
                        <td>
                          <span
                            className={`status ${leave.status.toLowerCase()}`}
                          >
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ReactPaginate
                  pageCount={pageCount}
                  onPageChange={handlePageChange}
                  containerClassName={"pagination"}
                  activeClassName={"active"}
                />
              </div>
            </div>
          )}
          {!showTable && (
            <div className="table-data">
              <div className="order">
                <form>
                  <div className="parentAddEmployee">
                    <div className="div1">
                      <h2>Employee Details</h2>
                    </div>
                    <div className="div2">
                      <label htmlFor="firstname">First Name</label>
                      <input type="text" id="firstname" name="firstname" />
                    </div>
                    <div className="div3">
                      <label htmlFor="middlename">Middle Name</label>
                      <input type="text" id="middlename" name="middlename" />
                    </div>
                    <div className="div4">
                      <label htmlFor="lastname">Last Name</label>
                      <input type="text" id="lastname" name="lastname" />
                    </div>
                    <div className="div5">
                      <label htmlFor="email">Email</label>
                      <input type="email" id="email" name="email" />
                    </div>
                    <div className="div6">
                      <label htmlFor="password">Password</label>
                      <input type="password" id="password" name="password" />
                    </div>
                    <div className="div7">
                      <label htmlFor="mobile">Mobile No.</label>
                      <input type="text" id="mobile" name="mobile" />
                    </div>
                    <div className="div8">
                      <label htmlFor="designation">Designation</label>
                      <select id="designation" name="designation">
                        <option value="1">Manager</option>
                        <option value="2">Tech Lead</option>
                        <option value="3">Sr. Developer</option>
                        <option value="4">Jr. Developer</option>
                        <option value="5">Intern</option>
                      </select>
                    </div>
                    <div className="div9">
                      <label htmlFor="team">Team</label>
                      <select id="team" name="team">
                        <option value="1">Java</option>
                        <option value="2">MERN</option>
                        <option value="3">Python</option>
                        <option value="4">Android</option>
                        <option value="5">PHP</option>
                      </select>
                    </div>

                    <div className="div10">
                      <label htmlFor="emergencyMobile">
                        Emergency Contact No.
                      </label>
                      <input
                        type="text"
                        id="emergencyMobile"
                        name="emergencyMobile"
                      />
                    </div>
                    <div className="div11">
                      <label htmlFor="gender">Gender</label>
                      <select id="gender" name="gender">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="div12">
                      <label htmlFor="blood_group">Blood Group</label>
                      <select id="blood_group" name="bloodGroup">
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div className="div13">
                      <button
                        className="table-button close"
                        onClick={toggleShowTable}
                      >
                        Close
                      </button>
                    </div>
                    <div className="div15">
                      <label htmlFor="birthdate">Birthdate</label>
                      <input type="date" id="birthdate" name="birthdate" />
                    </div>
                    <div className="div16">
                      <label htmlFor="date_of_joining">Joining Date</label>
                      <input
                        type="date"
                        id="date_of_joining"
                        name="dateOfJoining"
                      />
                    </div>
                    <div className="div14">
                      <button type="submit">ADD</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Leave;
