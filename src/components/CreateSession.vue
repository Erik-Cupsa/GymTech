<template>
    <div class="session-form">
        <h2>Create New Session</h2>
        <form @submit.prevent="submitSession"> <!-- make sure that submit function runs-->
            <div class="form-group">
                <label for="date">Date:</label>
                <input type="date" id="date" v-model="sessionDto.date">
            </div>
            <div class="form-group">
                <label for="time">Time:</label>
                <input type="time" id="time" v-model="sessionDto.time">
            </div>
            <div class="form-group">
                <label for="instructor">Instructor:</label>
                <select id="instructor" v-model="selectedInstructorId">
                    <option disabled value="">Please select one</option>
                    <option v-for="instructor in instructorsDto" :key="instructor.email" :value="instructor.email">
                        {{ instructor.person.name }}
                    </option>
                </select>
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
                <input type="text" id="duration" v-model="sessionDto.duration">
            </div>
            <div class="form-group">
                <label for="capacity">Capacity:</label>
                <input type="number" id="capacity" v-model="sessionDto.capacity">
            </div>
            <div class="form-group">
                <label for="description">Description:</label>
                <textarea id="description" v-model="sessionDto.description"
                    placeholder="Enter a description..."></textarea>
            </div>
            <button type="submit">Submit</button>
        </form>
    </div>
</template>


<script>
import axios from "axios";
import config from "../../config";
import moment from "moment";

const frontEndUrl = 'http://' + config.dev.host + ':' + config.dev.port;
const backendUrl = 'http://' + config.dev.backendHost + ':' + config.dev.backendPort;
console.log("backend url", backendUrl);
const AXIOS = axios.create({
    baseURL: backendUrl,
    headers: { 'Access-Control-Allow-Origin': frontEndUrl }
});

console.log(AXIOS.defaults.baseURL);

export default {
    name: 'CreateSession',
    created() {

        this.getInstructors();
        this.getClassTypes();
    },
    data() {
        return {
            selectedEmail: null,
            selectedInstructorId: null,
            selectedClassTypeId: null,
            selectedClassType: null,
            InstructorRegDto: {
                instructor: null,
                session: null,
                date: null,
            },
            sessionDto: {
                date: '',
                time: '',
                classTypeId: '',
                duration: null,
                capacity: null,
                description: ' ',
                location: 'Athletic Center'
            },

            instructorsDto: [], // the list of instructors

            classTypes: [],

        };
    },
    methods: {
        async submitSession() {
            const email = this.selectedInstructor.email;
            if (!email) {
                alert('Please select an instructor.');
                return;
            }
            const url = `/sessions/create/${email}`;
            // Make the POST request with the sessionData as the request body
            console.log(url)
            var localsessionDto = {
                date: new Date(this.sessionDto.date),
                startTime: moment(this.sessionDto.time, "HH:mm").format("HH:mm:ss"),
                endTime: moment(this.sessionDto.time, "HH:mm").add(this.sessionDto.duration, 'Minutes').format("HH:mm:ss"),
                capacity: parseInt(this.sessionDto.capacity, 10),
                description: this.sessionDto.description,
                location: 'Athletic Center',
                classType: this.selectedClassType,
                name: "some name"
            }
            var newsession;
            const response = await AXIOS.post(url, localsessionDto)
                .then(response => {
                    // Handle the response here (e.g., show a success message, redirect, etc.)
                    console.log('Session created successfully', response.data);
                    newsession = response.data;
                    alert("Session was created successfully!");
                    this.$router.push('/view-session-staff');
                })
                .catch(error => {
                    console.error('Response data:', error.response.data);
                    console.error('Status:', error.response.status);
                    console.error('Headers:', error.response.headers);
                    console.log(localsessionDto);
                });

            // assign data to instrucotrRegDto to make sure that instructor
            this.InstructorRegDto.instructor = this.selectedInstructor;
            this.InstructorRegDto.session = newsession;
            this.InstructorRegDto.date=newsession.date;

            //Rest controller url
            const regurl = '/instructor-registration/create';
            const regresponse = await AXIOS.post(regurl, this.InstructorRegDto)
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

        getInstructors() {
            const url = '/instructors';

            AXIOS.get(url)
                .then(response => {
                    this.instructorsDto = response.data;
                    console.log("found instructors", this.instructorsDto);
                })
                .catch(error => {
                    console.error('There was an error getting the instructors:', error);
                });
        },

        getClassTypes() {
            //The URL should be the endpoint from ClassTypeRestController that returns all classtypes
            const url = '/class-types';

            AXIOS.get(url)
                .then(response => {

                    this.classTypes = response.data;
                })
                .catch(error => {
                    console.error('There was an error getting the ClassTypes:', error);
                });
        },
    },
    watch: {
        selectedInstructorId(newEmail) {
            console.log("new email", newEmail);
            this.selectedInstructor = this.instructorsDto.find(instructor => instructor.email === newEmail) || null;
            console.log("new instructor", this.selectedInstructor);
        },
        selectedClassTypeId(newId) {
            console.log("new id", newId);
            this.selectedClassType = this.classTypes.find(classType => classType.id === newId) || null;
            console.log("new classtype", this.selectedClassType ? this.selectedClassType.name : null);
        }
    },
}
</script>
<style scoped>
.session-form {
    background-color: #222; /* Dark background */
    color: #fff; 
    padding: 20px;
    max-width: 700px;
    margin: 30px auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1); /* Subtle white shadow for depth */
    overflow-y: auto;
    max-height: 90vh;
}

.session-form h2 {
    color: #00b3ff; /* Blue accent color */
    text-align: center;
    margin-bottom: 30px;
    font-weight: 600; /* Bolder font for heading */
}

.form-group {
    margin-bottom: 15px;
    width: 90%; 
    display: flex; 
    flex-direction: column; /* Stack children vertically */
    align-items: center; /* Center children horizontally */
}

.form-group label {
    color: #fff;
    margin-bottom: 5px;
    font-size: 18px; 
}

.form-group input,
.form-group select,
.form-group textarea {
    background-color: #333; 
    color: #fff; 
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #444; 
    margin-bottom: 15px;
}

.form-group textarea {
    height: 100px;
    resize: vertical; 
    overflow-y: auto; 
}
.form-group .duration-input {
    background-color: #333; 
    color: #fff; 
    border: 1px solid #444; 
}

.form-group label[for="description"] {
    display: block;
    margin-bottom: 0.5rem; 
    color: #fff; 
    font-size: 1rem; 
}

/* Adjust the position of the textarea */
.form-group textarea {
    width: calc(100% - 20px); 
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #444; 
    background-color: #333; 
    color: #fff; 
    margin-left: auto; 
    margin-right: auto; 
    display: block; 
}

.form-group textarea {
    margin-top: 10px; 
    margin-bottom: 20px; 
}

button {
    background-image: linear-gradient(30deg, #0040ff, #15fd98); /* Gradient background */
    color: #fff;
    padding: 10px;
    border-radius: 4px;
    border: none;
    width: 100%;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-position: right center;
}

@media screen and (max-width: 1050px) {
    .session-form {
        padding: 10px;
        max-width: 100%;
        box-sizing: border-box;
    }
}
</style>
