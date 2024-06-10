<template>
  <div class="session-view-instructor">
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
            <th>Id</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="session in sessions" :key="session.id" @click="selectSession(session.id)"
            :class="{ selected: selectedSessionId === session.id }">
            <td>{{ session.classType.name }}</td>
            <td>{{ session.capacity }}</td>
            <td>{{ session.startTime }}</td>
            <td>{{ session.endTime }}</td>
            <td>{{ session.date }}</td>
            <td>{{ session.instructor }}</td>
            <td>{{ session.id }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="session-actions">
      <button @click="editSession">Edit Session</button>
      <button @click="createNewSession">Create New Session</button>
      <button @click="deleteSession">Delete Selected Session</button>
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
  name: 'SessionsStaffView',
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
    };
  },

  mounted() {
    setTimeout(() => {
      this.letterClass = "text-animate-hover";
    }, 4000);
    this.getSessions(); // Fetch sessions data when component is mounted
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
    deleteSession() {
      if (!this.selectedSessionId) {
        alert('Please select a session to delete.');
        return;
      }
 
      AXIOS.delete('/sessions/delete/' +this.selectedSessionId + '/' + user)
        .then(() => {
          this.sessions = this.sessions.filter(session => session.id !== this.selectedSessionId);
          this.selectedSessionId = null; // Clear selection
        })
        .catch(error => {
          alert("Deleting Failed: Are you sure you have permission?");
          console.error('There was an error deleting the session:', error.response);
        });
    },
    createNewSession() {
      this.$router.push('/create-session');
    },
    editSession() {
      this.$router.push({name: 'EditSession', params: { sessionId: parseInt(this.selectedSessionId) } });
    },
  }
};
</script>

<style scoped>
.text-animate {
  position: absolute;
  top: calc(50% + 30px);
  /* Adjust distance below navbar */
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

.selected {
  background-color: #0040ff;
  /* your hover color */
}

.session-view-instructor .text-zone {
  position: absolute;
  align-content: center;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  width: 40%;
  max-height: 90%;
  display: absolute;
}

.session-view-instructor {
  padding: 20px;
  margin: auto;
}

.content {
  position: relative;
}

.session-view-instructor h1 {
  top: 40%;
  /* Adjust distance below navbar */
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
  /* Adjust the font size here */
  padding: 5px;
}

tbody tr:hover {
  background-color: #0040ff;
}

td {
  /* background-color: #0040ff; */
  padding: 10px;
  /* text-align: center; */
}

tr:nth-child(even) {
  background-color: #f2f2f261;
}

tr:nth-child(odd) {
  background-color: #f2f2f2af;
}

.session-actions {
  display: flex;
  justify-content: flex-end;
  position: absolute;
  bottom: 30px;
  right: 40px;
}

/* Add margin-right to the first button */
.session-actions button:first-child {
  margin-right: 10px;
}

button {
  padding: 10px 20px;
  background-color: #0040ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  /* Add some space to the left of the button if needed */
}

button:hover {
  opacity: 0.85;
}
.selected td {
  background-color: blue; /* Highlight selected account in blue */
}
</style>
