<template>
    <div class="session-form">
        <h2>Edit Session</h2>
        <div class="form-group">
            <label for="date">Date:</label>
            <input type="date" id="date" v-model="sessionData.date">
        </div>
        <div class="form-group">
            <label for="time">Time:</label>
            <input type="time" id="time" v-model="sessionData.time">
        </div>
        <div class="form-group">
            <label for="classType">Class Type:</label>
            <select id="classType" v-model="selectedClassTypeId">
                <option disabled value="">Please select one</option>
                <option v-for="classType in classTypes" :key="classType.id" :value="classType.id">
                    {{ classType.name }}
                </option>
            </select>
        </div>
        <div class="form-group">
            <label for="duration">Duration (Minutes):</label>
            <input type="number" id="duration" v-model="sessionData.duration">
        </div>
        <div class="form-group">
            <label for="capacity">Capacity:</label>
            <input type="number" id="capacity" v-model="sessionData.capacity">
        </div>
        <div class="form-group">
            <label for="description">Description:</label>
            <textarea id="description" v-model="sessionData.description"></textarea>
        </div>
        <!-- Additional dropdowns for editing instructors -->
        <div class="form-group">
            <label for="instructorsToAdd">Add Instructor:</label>
            <select id="instructorsToAdd" v-model="selectedAddInstructor">
                <option disabled value="">Select an Instructor</option>
                <option v-for="instructor in availableInstructors" :key="instructor.email" :value="instructor.email">
                    {{ instructor.person.name }}
                </option>
            </select>
        </div>
        <div class="form-group">
            <label for="instructorsToRemove">Remove Instructor:</label>
            <select id="instructorsToRemove" v-model="selectedRemoveInstructor">
                <option disabled value="">Select an Instructor</option>
                <option v-for="instructorreg in sessionInstructorRegs" :key="instructorreg.instructor.email"
                    :value="instructorreg.instructor.email">
                    {{ instructorreg.instructor.person.name }}
                </option>
            </select>
        </div>
        <!-- Action buttons -->
        <div class="session-actions">
            <button @click="updateSession">Update Session</button>
        </div>
    </div>
</template>


<script>

import Navbar from "./Navbar";
import moment from "moment";
import axios from "axios";
import config from "../../config";
const frontEndUrl = 'http://' + config.dev.host + ':' + config.dev.port;
const backendUrl = 'http://' + config.dev.backendHost + ':' + config.dev.backendPort;
console.log("backend url", backendUrl);
let user = localStorage.getItem('email');
console.log("user",user);
const AXIOS = axios.create({
    baseURL: backendUrl,
    headers: { 'Access-Control-Allow-Origin': frontEndUrl }
});

export default {
    name: 'EditSession',
    
    props: {
    sessionId: {
        type:  Number, // Depending on what type your session ID is
        required: true
    }
},

    data() {
        return {
            sessionData: {
                date: '',
                time: '',
                classType: '',
                duration: null,
                capacity: null,
                description: ' ',
                location: 'Athletic Center'
            },
            sessionDto: {
                id: this.sessionId,
                date: '',
                startTime: '',
                classType: '',
                endTime: '',
                capacity: null,
                description: ' ',
                location: 'Athletic Center'
            },
            
            availableInstructors: [], // Should be filled with available instructors
            sessionInstructors: [], // Should be filled with instructors currently on the session
            sessionInstructorRegs: [],
            selectedClassTypeId: null,
            selectedAddInstructor: null,
            selectedRemoveInstructor: null,
            classTypes: []
            
            // ... other data properties for session fields
        };
    },
    methods: {
        /**
         * Returns a session dto and updates the global variable
         */
        getSessionDetails() {
            const url = '/sessions/' + this.sessionId;
            AXIOS.get(url)
                .then(response => {
                    console.log("Successfully Found Session", response.data);
                    this.sessionDto = response.data;
                })
                .catch(error => {
                    console.error('There was an error getting the session:', error);
                });
        },
        /**
         * Stores the data from the global object in a dto and then calls put
         */
        updateSession() {
            console.log("attempting to update session", this.sessionId);
            const url = '/sessions/'+this.sessionId+'/'+user;
            var localsessionDto = {
                id: this.sessionId,
                date: new Date(this.sessionData.date),
                startTime: moment(this.sessionData.time, "HH:mm").format("HH:mm:ss"),
                endTime: moment(this.sessionData.time, "HH:mm").add(this.sessionData.duration, 'Minutes').format("HH:mm:ss"),
                capacity: parseInt(this.sessionData.capacity, 10),
                description: this.sessionData.description,
                location: 'Athletic Center',
                classType: this.selectedClassType,
                name: "some name"
            }
            console.log(localsessionDto);
            AXIOS.put(url,localsessionDto)
                .then(response => {
                    console.log("sucessfully edited session", response.data)
                })
                .catch(error => {
                    console.error('There was an error editing the session:', error);
                    alert("Cannot edit session", error.response);
                });
            

            if (this.selectedAddInstructor) // if we have selected to add someone
            {
                this.addInstructor()
            }

            if (this.selectedRemoveInstructor) {
                this.removeInstructor()
            }
            this.$router.push('/view-session-staff');
        },
        /**
         * deletes an instructor registration with the selected instructor
         */
        removeInstructor() {
            const regurl = '/instructor-registration/delete/' + this.selectedRemoveInstructor.id + '/'
                + this.selectedRemoveInstructor.instructor.email + '/' + user;

            AXIOS.delete(regurl)
                .then(response => {
                    console.log("sucessfully removed instructor", response.data)
                })
                .catch(error => {
                    alert(error.response);
                    console.error('There was an error removing the instructor:', error.response);
                });
        },
        /**
         * Creates a new instructor registration with the selected instructor
         */
        addInstructor() {
            this.InstructorRegDto.instructor = this.selectedAddInstructor;
            this.InstructorRegDto.session = this.sessionDto;
            this.InstructorRegDto.date = this.sessionDto.date;

            //Rest controller url
            const regurl = '/instructor-registration/create';
            const regresponse = AXIOS.post(regurl, this.InstructorRegDto)
                .then(response => {
                    console.log("getting a response");
                    console.log('Registration created successfully', response.data);
                })
                .catch(error => {
                    alert(error.response);
                    console.log(this.InstructorRegDto.instructor.email);
                    console.log("Session ID", newsession.id);
                    console.error('Response data:', error.response.data);
                    console.error('Status:', error.response.status);
                    console.error('Headers:', error.response.headers);
                });
        },
        /**
         * Retuns a list of all the instructor registrations for this session
         */
        getSessionInstructors() {

            const url = '/instructor-registration-s/';
            AXIOS.get(url + this.sessionId)
                .then(response => {
                    console.log("Successfully Found Session Registration", response.data);
                    this.sessionInstructorRegs = response.data;
                })
                .catch(error => {
                    session.instructor = "To Be Assigned";
                    console.error('There was an error getting the registrations:', error);
                });

        },
        /**
         * Gets all instructors in the database
         */
        getInstructors() {
            const url = '/instructors';

            AXIOS.get(url)
                .then(response => {
                    this.availableInstructors = response.data;
                    console.log("found instructors", this.instructorsDto);
                })
                .catch(error => {
                    console.error('There was an error getting the instructors:', error);
                });
        }, // ... other methods for fetching session details, available instructors, etc.
        /**
         * Gets all the classtypes in the database
         */
        getClassTypes() {
            //The URL should be the endpoint from ClassTypeRestController that returns all classtypes
            const url = '/class-types';

            AXIOS.get(url)
                .then(response => {
                    console.log("Got class types", response.data)
                    this.classTypes = response.data;
                })
                .catch(error => {
                    console.error('There was an error getting the ClassTypes:', error);
                });
        },
    },
    created() {

        this.getSessionDetails();
        this.getInstructors();
        this.getClassTypes();
        this.getSessionInstructors();

    },
    watch: {
        //updates global variables
        selectedAddInstructor(newEmail) {
            console.log("new email", newEmail);
            this.selectedAddInstructor = this.availableInstructors.find(instructor => instructor.email === newEmail) || null;
            console.log("new instructor", this.selectedAddInstructor);
        },
        selectedRemoveInstructor(newEmail) {
            console.log("new email", newEmail);
            this.selectedRemovedInstructor = this.sessionInstructorregss.find(instructorreg => instructorreg.instructor.email === newEmail) || null;
            console.log("new instructor", this.selectedAddInstructor);
        },
        selectedClassTypeId(newId) {
            console.log("new id", newId);
            this.selectedClassType = this.classTypes.find(classType => classType.id === newId) || null;
            console.log("new classtype", this.selectedClassType ? this.selectedClassType.name : null);
        }
    },
    components: {
        Navbar
    },
};
</script>

<style scoped>

.session-form {
    background-color: #2c3e50;
    padding: 20px;
    max-width: 600px;
    margin: 50px auto;
    border-radius: 5px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

.body-content {
    padding-top: 70px;
}

.session-form h2 {
    color: #ecf0f1;
    text-align: center;
    margin-bottom: 30px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    color: #ecf0f1;
    display: block;
    margin-bottom: 5px;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #34495e;
    background-color: #34495e;
    color: #ecf0f1;
    box-sizing: border-box;
    margin-bottom: 10px;
}

.form-group input[type="date"],
.form-group input[type="time"] {
    cursor: pointer;
}

.form-group textarea {
    resize: vertical;
    height: 100px;
}

.form-group input:hover,
.form-group select:hover,
.form-group textarea:hover,
button:hover {
    background-color: #3d566e;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #3498db;
}

button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    background-image: linear-gradient(to right, #3498db, #2ecc71);
    color: #ffffff;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 20px;
}

button:focus {
    outline: none;
}

</style>
