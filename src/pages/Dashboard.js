import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/dashboard.css";
import Base from "../components/Base";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const employeeName = localStorage.getItem("employeeName");

  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState(null);
  const [leaveData, setLeaveData] = useState([]);
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          localStorage.clear();
          toast.error("Please login first");
          navigate("/login", { state: { fromLogout: true } });
        } else {
          await fetchEmployeeDetails();
          await fetchLeaveDetails();
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, token]);

  useEffect(() => {
    if (employeeName !== undefined) {
      document.title = `Dashboard | ${employeeName}`;
    } else {
      document.title = "Dashboard | ESS";
    }
  });

  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/auth/user/currentEmployee",
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
        setEmployeeData(data);
        localStorage.setItem("employeeName", data.firstname);
      } else {
        toast.error(message || "Couldn't load employee data");
      }
    } catch (error) {
      toast.error("Error loading employee details: " + error.message);
    }
  };

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Number of items to display per page

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

  // Update document title when employeeData changes

  useEffect(() => {
    axios
      .get("http://localhost:8080/auth/holiday/getAll")
      .then((response) => {
        const { success, data, message } = response.data;

        if (success) {
          const marks = data.map((holiday) => {
            const dateFrom = new Date(
              holiday.from[0],
              holiday.from[1] - 1,
              holiday.from[2]
            );
            return moment(dateFrom).format("YYYY-MM-DD");
          });
          setHolidays(marks);
        } else {
          toast.error(message);
        }
      })
      .catch((error) => console.error("Error fetching holidays:", error));
  }, []);

  return (
    <>
      {loading && (
        <div id="content">
          <main>
            <div className="loader"></div>
          </main>
        </div>
      )}
      {!loading && (
        <>
          <Base page="dashboard" />
          <div id="content">
            <main>
              <ul className="box-info calendars">
                <li className="calendars">
                  <Calendar
                    showNeighboringMonth={false}
                    tileClassName={({ date }) => {
                      if (date.getDay() === 0 || date.getDay() === 6) {
                        return "weekend";
                      } else {
                        return "normal";
                      }
                    }}
                  />
                </li>
                <li className="calendars">
                  <Calendar
                    selectRange={true}
                    tileClassName={({ date }) => {
                      if (date.getDay() === 0 || date.getDay() === 6) {
                        return "weekend";
                      } else {
                        return "normal";
                      }
                    }}
                  />
                </li>
                <li className="calendars">
                  <Calendar
                    showNeighboringMonth={false}
                    tileClassName={({ date }) => {
                      const formattedDate = moment(date).format("YYYY-MM-DD");
                      if (holidays.includes(formattedDate)) {
                        return "holiday";
                      } else if (date.getDay() === 0 || date.getDay() === 6) {
                        return "weekend";
                      } else {
                        return "normal";
                      }
                    }}
                  />
                  <span className="calendar-text">Your Holidays</span>
                </li>
              </ul>
              <ul className="box-info">
                <li>
                  <svg
                    className="bx"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                  >
                    <path d="m696-440-56-56 83-84-83-83 56-57 84 84 83-84 57 57-84 83 84 84-57 56-83-83-84 83Zm-336-40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
                  </svg>
                  <span className="text">
                    <h3>{leaveData.length}/18</h3>
                    <p>Leaves Applied</p>
                  </span>
                </li>
                <li>
                  <svg
                    className="bx"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                  >
                    <path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
                  </svg>
                  <span className="text">
                    <h3>180</h3>
                    <p>Employees</p>
                  </span>
                </li>
                <li>
                  <svg
                    className="bx"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                  >
                    <path d="m656-120-56-56 63-64-63-63 56-57 64 64 63-64 57 57-64 63 64 64-57 56-63-63-64 63Zm-416-80q17 0 28.5-11.5T280-240q0-17-11.5-28.5T240-280q-17 0-28.5 11.5T200-240q0 17 11.5 28.5T240-200Zm0 80q-50 0-85-35t-35-85q0-50 35-85t85-35q37 0 67.5 20.5T352-284q39-11 63.5-43t24.5-73v-160q0-83 58.5-141.5T640-760h46l-63-63 57-57 160 160-160 160-57-56 63-64h-46q-50 0-85 35t-35 85v160q0 73-47 128.5T354-203q-12 37-43.5 60T240-120Zm-64-480-56-56 63-64-63-63 56-57 64 64 63-64 57 57-64 63 64 64-57 56-63-63-64 63Z" />
                  </svg>
                  <span className="text">
                    <h3>4</h3>
                    <p>Projects Assigned</p>
                  </span>
                </li>
              </ul>
              <div className="table-data">
                <div className="order">
                  <div className="head">
                    <h3>Your Leave Applications</h3>
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
                      {displayedData.map((leave) => (
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
              <Toaster richColors />
            </main>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;