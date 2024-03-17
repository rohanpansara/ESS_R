import React, { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/dashboard.css";
import Base from "../components/Base";
import axios from "axios";
import modal_image from '../images/star-trophy.png'
import AddUser from "./AddUser";

const Dashboard = () => {
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [holidays, setHolidays] = useState([]);

  // Fetch employee data on component mount
  useEffect(() => {
    const authenticate = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login first");
          navigate("/login", { state: { fromLogout: true } });
        } else {
          await empDetails();
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while authenticating");
      }
    };

    const empDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/auth/user/currentEmployee",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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
          toast.error(message || "Couldn't load your data");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        toast.error("Error fetching employee data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    authenticate();
  }, []);

  // Update document title when employeeData changes
  useEffect(() => {
    const employeeName = localStorage.getItem("employeeName");
    if (!employeeName) {
      document.title = `Dashboard | ESS`;
    } else if (loading) {
      document.title = `Dashboard | Loading`;
    } else {
      document.title = `Dashboard | ${employeeName}`;
    }
  }, [employeeData, loading]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/auth/holiday/getAll")
      .then((response) => {

        const { success, data, message } = response.data;

        if (success) {
          const marks = data.map((holiday) => {
            const dateFrom = new Date(holiday.from[0], holiday.from[1] - 1, holiday.from[2]);
            return moment(dateFrom).format("YYYY-MM-DD");
          });
          setHolidays(marks);
        }
        else {
          toast.error(message);
        }
      })
      .catch((error) => console.error("Error fetching holidays:", error));
  }, []);

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {loading && <p>Loading...</p>}
      {!loading && (
        <>
          <Base page="dashboard" />
          <div id="content">
            <main>
              <ul className="box-info">
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
              <div class="table-data">
                <div class="order">
                  <div class="head">
                    <h3>Your Leave Applications</h3>
                    <button className="button" onClick={openModal}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="24"><path d="m696-440-56-56 83-84-83-83 56-57 84 84 83-84 57 57-84 83 84 84-57 56-83-83-84 83Zm-336-40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" /></svg>
                      Apply For Leave
                    </button>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Reason</th>
                        <th>Absence From</th>
                        <th>Absence To</th>
                        <th>Applied On</th>
                        <th>Type</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <p>John Doe</p>
                        </td>
                        <td>Sick Leave</td>
                        <td>01-10-2021</td>
                        <td>01-10-2024</td>
                        <td>01-10-2024</td>
                        <td><span class="type unpaid">Unpaid</span></td>
                        <td><span class="status approved">Approved</span></td>
                      </tr>
                      <tr>
                        <td>
                          <p>John Doe</p>
                        </td>
                        <td>Sick Leave</td>
                        <td>01-10-2021</td>
                        <td>01-10-2024</td>
                        <td>01-10-2024</td>
                        <td>
                          <span class="type paid">
                            Paid
                          </span>
                        </td>
                        <td><span class="status pending">Pending</span></td>
                      </tr>
                      <tr>
                        <td>
                          <p>John Doe</p>
                        </td>
                        <td>Sick Leave</td>
                        <td>01-10-2021</td>
                        <td>01-10-2024</td>
                        <td>01-10-2024</td>
                        <td><span class="type unpaid">Unpaid</span></td>
                        <td><span class="status rejected">Process</span></td>
                      </tr>
                      <tr>
                        <td>
                          <p>John Doe</p>
                        </td>
                        <td>Sick Leave</td>
                        <td>01-10-2021</td>
                        <td>01-10-2024</td>
                        <td>01-10-2024</td>
                        <td><span class="type paid">Paid</span></td>
                        <td><span class="status pending">Pending</span></td>
                      </tr>
                      <tr>
                        <td>
                          <p>John Doe</p>
                        </td>
                        <td>Sick Leave</td>
                        <td>01-10-2021</td>
                        <td>01-10-2024</td>
                        <td>01-10-2024</td>
                        <td><span class="type paid">Paid</span></td>
                        <td><span class="status approved">Approved</span></td>
                      </tr>
                    </tbody>
                  </table>
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
