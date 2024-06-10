<template>
  <div class="sessions-client-view">
    <Navbar />
    <div class="table-container">
      <h1>
        <AnimatedLetters :letterClass="letterClass" :strArray="welcomeArray" :idx="14" />
      </h1>
      <table>
        <thead>
          <tr>
            <th>Class Type</th>
            <th>Capacity</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Date</th>
            <th>Lead Instructor</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="session in sessions" :key="session.id" @click="selectSession(session.id)"
            :class="{ selected: selectedSessionId === session.id }">
            <td>{{ session.classType.name }}</td> <!-- Changed to session.classType -->
            <td>{{ session.capacity }}</td>
            <td>{{ session.startTime }}</td>
            <td>{{ session.endTime }}</td>
            <td>{{ session.date }}</td>
            <td>{{ session.instructor }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="register-button">
      <button @click="registerToSession">Register</button>
    </div>
  </div>
</template>

<script>
import AnimatedLetters from "./AnimatedLetters";
import Navbar from "./Navbar";

import axios from "axios";
import config from "../../config";
const frontEndUrl = 'http://' + config.dev.host + ':' + config.dev.port;
const backendUrl = 'http://' + config.dev.backendHost + ':' + config.dev.backendPort;
console.log("backend url", backendUrl);
let user = localStorage.getItem('email');
console.log(user);
const AXIOS = axios.create({
  baseURL: backendUrl,
  headers: { 'Access-Control-Allow-Origin': frontEndUrl }
});

export default {
  name: 'SessionsClientView',
  created() {
    this.getSessions();
  },

  data() {
    return {
      letterClass: "text-animate",
      welcomeArray: "Sessions",
      sessions: [],
      leadInstructors: [],
      selectedSessionId: null,

      customerRegistrationDto: {
        customer: null,
        session: null,
      },
      customerObject: [],

      sessionDto: {
        id: this.selectedSessionId,
        date: '',
        startTime: '',
        classType: '',
        endTime: '',
        capacity: null,
        description: ' ',
        location: 'Athletic Center'
      }

    };
  },

  mounted() {
    setTimeout(() => {
      this.letterClass = "text-animate-hover";
    }, 4000);
    this.getSessions(); // Fetch sessions data when component is mounted
    //this.getCustomer(); // get customer checking if it works
  },

  components: {
    AnimatedLetters,
    Navbar
  },

  methods: {
    getSessions() {
      const url = '/sessions';
      AXIOS.get(url)
        .then(response => {
          console.log("Successfully Found Sessions", response.data);
          this.sessions = response.data;
          this.getInstructor(); // Call getInstructor here, after sessions is set
        })
        .catch(error => {
          console.error('There was an error getting the sessions:', error);
        });
    },

    getInstructor() {
      // Now this.sessions should have data if getSessions was successful
      const url = '/instructor-registration-s/';
      for (const session of this.sessions) {
        var sessionId = session.id
        AXIOS.get(url + sessionId)
          .then(response => {
            console.log("Successfully Found Session Registration", response.data);
            let instructor = response.data;
            session.instructor = instructor[0].instructor.person.name;
          })
          .catch(error => {
            session.instructor = "To Be Assigned";
            console.error('There was an error getting the sessions:', error);
          });

      }
    },
    selectSession(sessionId) {
      this.selectedSessionId = sessionId;
      console.log("session id", this.selectedSessionId);
    },
    fetchSessions() {
        // can fetch the sessions data from the database using API calls or other methods
        // For now, let's simulate some sample sessions data
        this.sessions = [
        { id: 1, classType: "Yoga", capacity: 20, duration: "1 hour", instructor: "John Doe", time: "10:00 AM", date: "2024-04-06" },
        { id: 2, classType: "Pilates", capacity: 15, duration: "1 hour", instructor: "Jane Smith", time: "11:30 AM", date: "2024-04-07" },

      ];
    },
    addSession() {
      // Implement logic to add a new session
    },
    getCustomer() {
      console.log("Getting customer...");
      const email = localStorage.getItem('email');
      return AXIOS.get('/customers/' + email)
        .then(response => {
          console.log("Successfully Found Customer", response.data);

          // to later pass customerDto object in put requests
          let customer = response.data;
          this.customerObject = customer;
          return response.data;
        })
        .catch(error => {
            console.error('There was an error getting the customer:', error);
        });
    },

    registerToSession() {
      if (!this.selectedSessionId) {
        alert('Please select a session to register to.');
        return;
      }
      this.getCustomer()
        .then((response) => {
          this.customerRegistrationDto.customer = response.data;
        }).catch(error => {
          console.error('There was an error getting the customer:', error);
        });
      this.customerRegistrationDto.session = this.sessionDto;

      console.log("registration customer: " + this.customerRegistrationDto.customer);
      console.log("customer object: " + this.customerObject);

      console.log("registration session: " + this.customerRegistrationDto.session);
      console.log("sessionDto object: " + this.sessionDto);

      AXIOS.post('/customer-registration/register', this.customerRegistrationDto)
        .then(response => {
          console.log("Successfully Registered for session", response.data);
        })
        .catch(error => {
          console.error('There was an error registering for the session:', error);
        });
    }
  }
};
</script>

<style scoped>
.text-animate {
  position: absolute;
  top: calc(50% + 30px);
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 60px;
  margin: 0;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
}

.text-animate-hover {
  color: #fff;
  font-size: 60px;
  margin: 0;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: color 0.5s ease-in-out;
}

.sessions-client-view .text-zone {
  position: absolute;
  align-content: center;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  width: 40%;
  max-height: 90%;
  display: absolute;
}

.sessions-client-view {
  padding: 20px;
  margin: auto;
}

.content {
  position: relative;
}

.sessions-client-view h1 {
  top: 40%;
  color: #fff;
  font-size: 60px;
  margin: 0;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
}

.table-container {
  overflow-x: auto;
  overflow-y: auto;
  top: calc(45% + 20px);
  position: absolute;
  left: 50%;
  transform: translate(-50%, -40%);
  width: 80%;
  max-height: calc(80%);
}

table {
  width: 100%;
  border-collapse: collapse;
}

table,
th,
td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ccc;
  color: #FFF;
}

th {
  background-color: #f0f0f0;
  color: #444;
  font-size: 20px;
  padding: 5px;
}

tbody tr:hover {
  background-color: #0040ff;
}

td {
  padding: 10px;
}

tr:nth-child(even) {
  background-color: #f2f2f261;
}

tr:nth-child(odd) {
  background-color: #f2f2f2af;
}

.register-button {
  display: flex;
  justify-content: flex-end;
  position: absolute;
  bottom: 30px;
  right: 40px;
}

button {
  padding: 10px 20px;
  background-color: #0040ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.85;
}

.selected {
  background-color: #0040ff;
}

.selected td {
  background-color: blue;
}
</style>
