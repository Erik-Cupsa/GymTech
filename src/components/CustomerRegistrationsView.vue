<template>
    <div class="sessionRegistrations-view">
        <Navbar />
        <div class="table-container">
            <h1>
                <AnimatedLetters :letterClass="letterClass" :strArray="welcomeArray" :idx="14" />
            </h1>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Date</th>
                        <th>Session</th>
                        <th>Customer</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="registration in registrations" :key="registration.id"
                        @click="selectRegistration(registration.id)"
                        :class="{ selected: selectedRegistrationId === registration.id }">
                        <td>{{ registration.id }}</td>
                        <td>{{ registration.date }}</td>
                        <td>{{ registration.session }}</td>
                        <td>{{ registration.customer }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="session-actions">
            <button @click="editRegistration">Edit Registration</button>
            <button @click="createNewRegistration">Create New Registration</button>
            <button @click="deleteRegistration">Delete Selected Registration</button>
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
    props: {
        registrationId: {
            id: Number
        }
    },
    created() {
        this.getSessions();
    },

    data() {
        return {
            letterClass: "text-animate",
            welcomeArray: "Customer Registrations",
            registrations: [],
            leadInstructors: [],
            selectedRegistraionId: null,

            customerObject: [],
        };
    },
    methods: {
        //al get methods
        getRegistrations() {
            const url = '/customer-registrations/' + user;
            AXIOS.get(url)
                .then(response => {
                    console.log("Successfully Found Registrations", response.data);
                    this.registrations = response.data;
                    this.getSession(); // Call getInstructor here, after sessions is set
                })
                .catch(error => {
                    console.error('There was an error getting the sessions:', error);
                });
        },
        getSession() {
            const url = '/sessions/';
            for (const registration of this.registrations) {
                var regId = registration.id;
                AXIOS.get(url + regId)
                    .then(response => {
                        console.log("Successfully Found Customer Registration", response.data);
                        let session = response.data;
                        registration.session = session[0].id;
                    })
                    .catch(error => {
                        registration.session = "To Be Assigned";
                        console.error("Error getting the registrations", error);
                    })
            }
        },
        //selecting a registration
        selectRegistration(registrationId) {
            this.selectedRegistraionId = registrationId;
            console.log("registration id: ", this.selectedRegistraionId);
        },
        deleteRegistration() {
            if (!this.selectedRegistrationId) {
                console.error("No registration selected for deletion.");
                return;
            }

            const url = `/customer-registrations/remove/${this.selectedRegistrationId}`;
            AXIOS.delete(url)
                .then(response => {
                    console.log("Successfully deleted registration", response);
                })
                .catch(error => {
                    console.error('Error deleting registration:', error);
                });
        },
        createNewRegistration() {
            const registrationData = {
                date: this.date,
                session: this.session,
                customer: this.customer
            };

            AXIOS.post('/customer-registrations/register', registrationData)
                .then(response => {
                    console.log("Successfully created new registration", response);
                })
                .catch(error => {
                    console.error('Error creating new registration:', error);
                });
        },
        editRegistration() {
            const registrationIdToUpdate = this.selectedRegistrationId;

            const updatedRegistrationData = {
                date: this.date,
                session: this.session,
                customer: this.customer
            };

            AXIOS.put(`/customer-registration/update/${registrationIdToUpdate}`, updatedRegistrationData)
                .then(response => {
                    console.log("Successfully updated registration", response);
                })
                .catch(error => {
                    console.error('Error updating registration:', error);
                });
        }
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
}
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

    .selected {
        background-color: #0040ff;
    }

    .sessionRegistrations-view .text-zone {
        position: absolute;
        align-content: center;
        left: 10%;
        top: 50%;
        transform: translateY(-50%);
        width: 40%;
        max-height: 90%;
        display: absolute;
    }

    .sessionRegistrations-view {
        padding: 20px;
        margin: auto;
    }

    .content {
        position: relative;
    }

    .sessionRegistrations-view h1 {
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

    .session-actions {
        display: flex;
        justify-content: flex-end;
        position: absolute;
        bottom: 30px;
        right: 40px;
    }

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
    }

    button:hover {
        opacity: 0.85;
    }

    .selected td {
        background-color: blue;
    }
</style>