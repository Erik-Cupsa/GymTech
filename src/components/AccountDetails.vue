<template>
    <div class="container-details-page">
        <Navbar />
        <h1>
        <AnimatedLetters :letterClass="letterClass" :strArray="welcomeArray" :idx="14" />
      </h1>
        <div class="user-info">

            <div class="form-group">
                <label for="email">Email: </label>
                <input type="email" id="email" v-model="customerDto.email" :readonly="isReadonly">
            </div>

            <div class="form-group">
                <label for="password">Password: </label>
                <input type="password" id="password" v-model="customerDto.password" :readonly="isReadonly">
            </div>

            <div class="form-group">
                <label for="credit">Credit Card: </label>
                <input type="text" id="credit" v-model="customerDto.creditCard" :readonly="isReadonly">
            </div>

            <div v-if="!editMode" class="form-group">
                <button @click="toggleEditMode">Edit</button>
            </div>

            <div v-else class="form-group">
                <button @click="saveChanges">Save</button>
                <button @click="cancelEdit">Cancel</button>
            </div>

        </div>

    </div>

</template>


<script>
import Navbar from './Navbar';
import AXIOS from './axiosConfig.js';
import AnimatedLetters from './AnimatedLetters';
import { isReadonly } from 'vue';

export default {
    data() {
        return {
            letterClass: "text-animate",
            welcomeArray: "Account Details",
            customerDto: {
                creditCard: '',
                email: '',
                password: ''
            },
            oldFields: {
                creditCard: '',
                email: '',
                password: ''
            },
            customerObject: [],
            editMode: false,
            isReadonly: true
        }
    },
    mounted() {
        /*setTimeout(() => {
        this.letterClass = "text-animate-hover";
        }, 4000);*/
        //this.getCustomer();
    },
    created() {
        this.getCustomer();
    },
    methods: {
        // Method to toggle edit mode
        toggleEditMode() {
            this.editMode = !this.editMode;
            this.isReadonly = !this.isReadonly;
            // Log the current value of isReadonly
            console.log(isReadonly);
            // Refresh customer data
            this.getCustomer();
        },
        // Method to fetch customer data
        async getCustomer() {
            console.log("Getting customer...");
            // Retrieve email from local storage
            const email = localStorage.getItem('email');
            // Fetch customer data from server
            AXIOS.get('/customers/' + email)
                .then(response => {
                    console.log("Successfully Found Customer", response.data);
                    this.customerDto.creditCard = response.data.creditCardNumber;
                    this.customerDto.email = response.data.email;
                    this.customerDto.password = response.data.password;
                    // to reset data in the <input> for each field
                    this.oldFields.creditCard = response.data.creditCardNumber;
                    this.oldFields.email = response.data.email;
                    this.oldFields.password = response.data.password;
                    // to later pass customerDto object in put requests
                    let customer = response.data;
                    this.customerObject = customer;
                })
                .catch(error => {
                    console.error('There was an error getting the customer:', error);
                });
        },
        // Method to save changes
        saveChanges() {
            console.log("Attempting to update customer information");
            // Update email
            AXIOS.put('/customers/updateEmail/' + this.customerDto.email, this.customerObject)
                .then(response => {
                    console.log("email changed", response.data);
                })
                .catch(error => {
                    console.error('error changing email:', error);
                });
            //Update password  
            AXIOS.put('/customers/updatePassword' + this.customerDto.password, this.customerObject)
                .then(response => {
                    console.log("password changed", response.data);
                })
                .catch(error => {
                    console.error('error changing password:', error);
                });
            //Update credit card 
            AXIOS.put('/customers/updateCreditCard/' + this.customerDto.creditCard, this.customerObject)
                .then(response => {
                    console.log("credit card changed", response.data);
                })
                .catch(error => {
                    console.error('error changing credit card:', error);
                });
            this.toggleEditMode();
        },
        cancelEdit() {
            console.log("Attempting to cancel changes");
            //restore original data
            this.customerDto.email = this.oldFields.email;
            this.customerDto.password = this.oldFields.password;
            this.customerDto.creditCard = this.oldFields.creditCard;
            //exit edit mode
            this.toggleEditMode();
        }

    },
    components: {
        AnimatedLetters,
        Navbar
    }
}
</script>


<style scoped>
.container-details-page .text-animate {
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
.container-details-page .text-animate-hover {
  color: #fff;
  font-size: 60px;
  margin: 0;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: color 0.5s ease-in-out;
}

.container-details-page .text-zone {
  position: absolute;
  align-content: center;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  width: 40%;
  max-height: 90%;
  display: absolute;
}

.container-details-page h1 {
  position: relative;
  top: 50%;
  color: #fff;
  font-size: 60px;
  margin: 0;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
}

.container-details-page {
    margin-top: 100px;
}

.letter-class {
    justify-content: center;
    display: flex;
}

.user-info {
    margin-top: 70px;
    margin: 50px;
    padding-left: 5%;
}

.form-group label {
    color: #ecf0f1;
    display: block;
    margin-bottom: 5px;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 70%;
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
    width: 20%;
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
